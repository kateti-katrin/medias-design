module Api
  class ArticlesController < BaseController
    before_action :set_article, only: :show

    def index
      articles = Article.with_primary_tag.includes(:likes, :comments).newest_first
      articles = articles.by_tag(params[:tag]) if params[:tag].present?

      render json: {
        data: articles.map { |article| article_payload(article) }
      }
    end

    def show
      render json: {
        data: article_payload(@article, include_body: true)
      }
    end

    private

    def set_article
      @article = find_article_by_api_param
      @article = @article.class.includes(:primary_tag, :likes, :comments).find(@article.id)
    end

    def article_payload(article, include_body: false)
      payload = {
        id: article.id,
        public_uuid: article.public_uuid,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        tag: article.primary_tag&.name || article.tag,
        image_url: article.image,
        views_count: article.views_count,
        likes_count: article.likes.size,
        comments_count: article.comments.size,
        created_at: article.created_at&.iso8601
      }

      payload[:body] = article.body if include_body
      payload
    end
  end
end
