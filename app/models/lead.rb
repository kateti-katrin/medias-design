class Lead < ApplicationRecord
  KINDS = %w[quote brief].freeze

  validates :kind, presence: true, inclusion: { in: KINDS }
  validates :payload, presence: true
  validates :contact_email,
            format: { with: URI::MailTo::EMAIL_REGEXP },
            length: { maximum: 255 },
            allow_blank: true
  validates :contact_name, length: { maximum: 100 }, allow_blank: true
end
