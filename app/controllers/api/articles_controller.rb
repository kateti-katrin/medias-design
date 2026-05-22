module Api
  class ArticlesController < BaseController
    before_action :set_article, only: :show

    # JSON отдаётся через JBuilder-шаблоны:
    #   app/views/api/articles/index.json.jbuilder
    #   app/views/api/articles/show.json.jbuilder
    #   app/views/api/articles/_article.json.jbuilder (партиал)
    def index
      @articles = Article.with_primary_tag.includes(:likes, :comments).newest_first
      @articles = @articles.by_tag(params[:tag]) if params[:tag].present?
    end

    def show
    end

    private

    def set_article
      @article = find_article_by_api_param
      @article = @article.class.includes(:primary_tag, :likes, :comments).find(@article.id)
    end
  end
end
