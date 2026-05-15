class Profile < ApplicationRecord
  belongs_to :user

  validates :display_name, length: { maximum: 100 }, allow_blank: true
  validates :bio, length: { maximum: 1000 }, allow_blank: true
  validates :avatar_url,
            length: { maximum: 500 },
            format: {
              with: %r{\Ahttps?://[^\s<>"']+\z},
              message: "must start with http:// or https://"
            },
            allow_blank: true

  before_validation :normalize_fields

  private

  def normalize_fields
    self.display_name = display_name.to_s.strip.presence
    self.bio = bio.to_s.strip.presence
    self.avatar_url = avatar_url.to_s.strip.presence
  end
end
