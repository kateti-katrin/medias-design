class ArticlesController < ApplicationController
  def index
    @articles = Article.order(:id)
  end

  def show
    @article = Article.find(params[:id])
    @other_articles = Article.where.not(id: @article.id).order(:id)
  end
end
