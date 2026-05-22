class User < ApplicationRecord
  has_one :profile, dependent: :destroy
  has_many :favourite_articles, dependent: :destroy
  has_many :favourites, through: :favourite_articles, source: :article
  has_many :reactions, dependent: :destroy
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
