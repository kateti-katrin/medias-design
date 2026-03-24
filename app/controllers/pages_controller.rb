class PagesController < ApplicationController
  def home
    @articles = Article.order(:id).limit(4)
    @services = Service.order(:id).limit(2)
  end
end
