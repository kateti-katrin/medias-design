class Like < ApplicationRecord
  belongs_to :likeable, polymorphic: true

  validates :likeable_type, presence: true
  validates :likeable_id, presence: true
  validates :visitor_token, presence: true, length: { maximum: 120 }
  validates :visitor_token, uniqueness: {
    scope: [:likeable_type, :likeable_id],
    case_sensitive: false
  }

  before_validation :normalize_visitor_token

  private

  def normalize_visitor_token
    self.visitor_token = visitor_token.to_s.strip.downcase
  end
end
