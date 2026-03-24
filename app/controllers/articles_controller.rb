class ArticlesController < ApplicationController
  RECENT_ARTICLES_LIMIT = 5
  before_action :find_article_by_param, only: [:show, :track_view]

  def index
    @articles = Article.order(:id)
    tag_value = selected_tag_from_params_or_session
    return if tag_value.blank?

    filtered_articles = @articles.by_tag(tag_value)
    return if filtered_articles.blank?

    @articles = filtered_articles
    session[:articles_last_tag] = tag_value
  end

  def show
    track_recent_articles(@article)
    @other_articles = Article.where.not(id: @article.id).order(:id)
  end

  def track_view
    viewed_ids = Array(session[:viewed_article_ids]).map(&:to_i)
    counted = !viewed_ids.include?(@article.id)

    if counted
      @article.increment!(:views_count)
      viewed_ids << @article.id
      session[:viewed_article_ids] = viewed_ids.uniq
    end

    render json: {
      article_id: @article.id,
      views_count: @article.views_count,
      counted: counted
    }
  end

  private

  def find_article_by_param
    @article = Article.find_by(slug: params[:id])
    @article ||= Article.find_by(id: params[:id]) if params[:id].to_s.match?(/\A\d+\z/)
    raise ActiveRecord::RecordNotFound unless @article
  end

  def selected_tag_from_params_or_session
    from_params = params[:tag].to_s.strip
    return from_params if from_params.present?

    session[:articles_last_tag].to_s.strip.presence
  end

  def track_recent_articles(article)
    ids = Array(session[:recent_article_ids]).map(&:to_i)
    ids.delete(article.id)
    ids.unshift(article.id)
    session[:recent_article_ids] = ids.take(RECENT_ARTICLES_LIMIT)

    slugs = cookies.signed[:recent_article_slugs].to_s.split(",").reject(&:blank?)
    slugs.delete(article.slug)
    slugs.unshift(article.slug)

    cookies.signed[:recent_article_slugs] = {
      value: slugs.take(RECENT_ARTICLES_LIMIT).join(","),
      expires: 30.days.from_now,
      httponly: true
    }
  end
end
