class User < ApplicationRecord
  has_one :profile, dependent: :destroy
  accepts_nested_attributes_for :profile, update_only: true

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  after_create_commit :ensure_profile!

  private

  def ensure_profile!
    create_profile! unless profile
  end
end
