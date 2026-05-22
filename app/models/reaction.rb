class Reaction < ApplicationRecord
  KINDS = %w[fire heart mind lol wow].freeze
  KIND_LABELS = {
    "fire"  => "🔥",
    "heart" => "❤️",
    "mind"  => "🤯",
    "lol"   => "😆",
    "wow"   => "👀"
  }.freeze

  belongs_to :article
  belongs_to :user, optional: true

  validates :kind, presence: true, inclusion: { in: KINDS }
  validates :visitor_token, presence: true, if: -> { user_id.blank? }

  scope :by_kind, ->(kind) { where(kind: kind) }

  def self.counts_for(article)
    where(article_id: article.id).group(:kind).count
  end
end
