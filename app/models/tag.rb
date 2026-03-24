class Tag < ApplicationRecord
  has_many :articles, foreign_key: :tag_id, inverse_of: :primary_tag, dependent: :restrict_with_exception

  validates :name, presence: true, uniqueness: { case_sensitive: false }, length: { maximum: 100 }
  validates :slug, presence: true, uniqueness: true
  validates :slug, format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }, length: { maximum: 120 }

  before_validation :normalize_name
  before_validation :normalize_slug
  before_validation :ensure_slug

  scope :alphabetical, -> { order(:name) }
  scope :by_name, ->(value) { where("LOWER(tags.name) = ?", value.to_s.strip.downcase) }
  scope :by_slug, ->(value) { where(slug: value.to_s.strip) }
  scope :with_articles, -> { joins(:articles).distinct }

  private

  def normalize_name
    self.name = name.to_s.strip.downcase.presence
  end

  def normalize_slug
    value = slug.to_s.strip
    return if value.blank?

    self.slug = I18n.transliterate(value, locale: :ru).parameterize.presence
  end

  def ensure_slug
    return if slug.present?

    transliterated = I18n.transliterate(name.to_s, locale: :ru)
    self.slug = transliterated.parameterize.presence || "tag"
  end
end
