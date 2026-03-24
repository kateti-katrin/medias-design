class Comment < ApplicationRecord
  belongs_to :article
  belongs_to :parent, class_name: "Comment", optional: true
  has_many :replies, class_name: "Comment", foreign_key: :parent_id, dependent: :destroy, inverse_of: :parent

  validates :body, presence: true, length: { maximum: 5000 }
  validates :author_name, length: { maximum: 100 }, allow_blank: true

  before_validation :normalize_fields

  private

  def normalize_fields
    self.body = body.to_s.strip.presence
    self.author_name = author_name.to_s.strip.presence
  end
end
