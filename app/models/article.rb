class Article < ApplicationRecord
  belongs_to :primary_tag, class_name: "Tag", foreign_key: :tag_id, inverse_of: :articles
  has_many :likes, as: :likeable, dependent: :destroy
  has_many :comments, dependent: :destroy
  mount_uploader :cover_image, ArticleCoverUploader

  validates :title, presence: true, length: { maximum: 255 }
  validates :body, presence: true
  validates :public_uuid, presence: true, uniqueness: true
  validates :public_uuid, format: { with: /\A[0-9a-f\-]{36}\z/ }
  validates :slug, presence: true, uniqueness: true
  validates :slug, format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }
  validates :primary_tag, presence: true
  validate :image_source_presence

  before_validation :normalize_fields
  before_validation :assign_primary_tag_from_legacy_name
  before_validation :sync_legacy_tag_name
  before_validation :ensure_public_uuid
  before_validation :ensure_slug

  scope :with_primary_tag, -> { includes(:primary_tag) }
  scope :newest_first, -> { order(created_at: :desc, id: :desc) }
  scope :recent, ->(limit_count = 5) { newest_first.limit(limit_count) }

  scope :by_tag, ->(value) do
    normalized_name = normalize_tag_name(value)
    normalized_slug = normalize_tag_slug(normalized_name)

    joins(:primary_tag).where(
      "LOWER(tags.name) = :name OR tags.slug = :slug",
      name: normalized_name,
      slug: normalized_slug
    )
  end

  def to_param
    slug
  end

  def image
    uploaded_cover = cover_image&.url
    return uploaded_cover if uploaded_cover.present?

    legacy_image = super
    return legacy_image if legacy_image.present?

    ArticleCoverUploader.new.default_url
  end

  private

  CYRILLIC_TO_LATIN = {
    "а" => "a", "б" => "b", "в" => "v", "г" => "g", "д" => "d", "е" => "e",
    "ё" => "e", "ж" => "zh", "з" => "z", "и" => "i", "й" => "y", "к" => "k",
    "л" => "l", "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r",
    "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "h", "ц" => "ts",
    "ч" => "ch", "ш" => "sh", "щ" => "shch", "ъ" => "", "ы" => "y", "ь" => "",
    "э" => "e", "ю" => "yu", "я" => "ya"
  }.freeze

  class << self
    private

    def normalize_tag_name(value)
      value.to_s.strip.downcase
    end

    def normalize_tag_slug(value)
      I18n.transliterate(value, locale: :ru).parameterize
    end
  end

  def normalize_fields
    self.title = title.to_s.strip.presence
    self.excerpt = excerpt.to_s.strip.presence
    self[:image] = self[:image].to_s.strip.presence
    self.body = body.to_s.strip.presence
  end

  def image_source_presence
    return if cover_image.present? || self[:image].present?

    errors.add(:image, "can't be blank")
  end

  def assign_primary_tag_from_legacy_name
    return if primary_tag.present?

    raw_name = self[:tag].to_s.strip.downcase
    return if raw_name.blank?

    self.primary_tag = Tag.find_or_create_by!(name: raw_name)
  end

  def sync_legacy_tag_name
    return if primary_tag.blank?

    self[:tag] = primary_tag.name
  end

  def ensure_public_uuid
    return if public_uuid.present?

    self.public_uuid = SecureRandom.uuid
  end

  def ensure_slug
    return unless slug.blank? || will_save_change_to_title?

    base_slug = slug_from_title(title)
    candidate = base_slug
    suffix = 2

    while Article.where.not(id: id).exists?(slug: candidate)
      candidate = "#{base_slug}-#{suffix}"
      suffix += 1
    end

    self.slug = candidate
  end

  def slug_from_title(value)
    source = value.to_s.strip
    transliterated = I18n.transliterate(source, locale: :ru)
    transliterated = transliterate_ru(source) if transliterated.match?(/[А-Яа-яЁё]/)

    transliterated.parameterize.presence || "article"
  end

  def transliterate_ru(text)
    text.to_s.each_char.map do |char|
      lower = char.downcase
      mapped = CYRILLIC_TO_LATIN[lower]
      mapped.nil? ? char : mapped
    end.join
  end
end
