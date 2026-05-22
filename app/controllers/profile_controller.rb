class ProfileController < ApplicationController
  before_action :authenticate_user!

  def show
    @profile = current_user.profile || current_user.create_profile!
    @favourites = current_user.favourite_articles
                              .includes(article: :primary_tag)
                              .order(created_at: :desc)
                              .limit(10)
    @reactions_count = current_user.reactions.count
    @comments_count = current_user.respond_to?(:comments) ? 0 : 0
  end

  def edit
    @profile = current_user.profile || current_user.create_profile!
  end

  def update
    @profile = current_user.profile || current_user.create_profile!
    if @profile.update(profile_params)
      redirect_to profile_path, notice: "Профиль обновлён"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:profile).permit(:display_name, :bio, :avatar_url)
  end
end
