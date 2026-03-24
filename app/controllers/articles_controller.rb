class ArticlesController < ApplicationController
  def index
    @articles = Article.order(:id)
  end

  def show
    @article = Article.find(params[:id])
  end
end
