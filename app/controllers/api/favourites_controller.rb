module Api
  class FavouritesController < BaseController
    before_action :authenticate_user!

    def index
      favourites = current_user.favourite_articles.includes(:article).order(created_at: :desc)
      render json: favourites.map { |f| article_payload(f.article) }
    end

    def create
      article = find_article_by_api_param
      favourite = current_user.favourite_articles.find_or_create_by!(article: article)
      render json: { article_id: article.id, favourite: true, created_at: favourite.created_at }, status: :created
    end

    def destroy
      article = find_article_by_api_param
      current_user.favourite_articles.where(article: article).destroy_all
      render json: { article_id: article.id, favourite: false }
    end

    private

    def article_payload(article)
      {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        tag: article.primary_tag&.name,
        image: article.image,
        url: article_url(article)
      }
    end
  end
end
