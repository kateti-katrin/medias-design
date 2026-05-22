class FavouritesController < ApplicationController
  before_action :authenticate_user!

  def index
    @favourites = current_user.favourite_articles
                              .includes(article: :primary_tag)
                              .order(created_at: :desc)
                              .paginate(page: params[:page], per_page: 6)
  end
end
