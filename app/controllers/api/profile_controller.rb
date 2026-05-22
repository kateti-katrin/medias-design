module Api
  class ProfileController < BaseController
    before_action :authenticate_user!

    def show
      profile = current_user.profile || current_user.create_profile!
      favourites_count = current_user.favourite_articles.count
      reactions_count = current_user.reactions.count
      likes_count = current_user.respond_to?(:likes) ? current_user.likes.count : 0

      render json: {
        id: current_user.id,
        email: current_user.email,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        stats: {
          favourites: favourites_count,
          reactions: reactions_count,
          likes: likes_count
        }
      }
    end
  end
end
