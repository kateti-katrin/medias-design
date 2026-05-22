class ArticlesController < ApplicationController
  RECENT_ARTICLES_LIMIT = 5
  before_action :find_article_by_param, only: [:show, :track_view, :toggle_favourite, :toggle_reaction]

  def index
    @articles = Article.with_primary_tag.order(:id).paginate(page: params[:page], per_page: 8)
  end

  def show
    track_recent_articles(@article)
    @other_articles = Article.where.not(id: @article.id).order(:id)
    @is_favourite = current_user && current_user.favourite_articles.exists?(article_id: @article.id)
    @reactions = build_reactions_payload(@article)
  end

  def toggle_favourite
    unless user_signed_in?
      respond_to do |format|
        format.html { redirect_to new_user_session_path, alert: "Войди, чтобы добавлять в избранное" }
        format.json { render json: { error: "auth_required", redirect: new_user_session_path }, status: :unauthorized }
      end
      return
    end

    fav = current_user.favourite_articles.find_by(article: @article)
    if fav
      fav.destroy
      is_favourite = false
    else
      current_user.favourite_articles.create!(article: @article)
      is_favourite = true
    end

    respond_to do |format|
      format.html { redirect_back fallback_location: article_path(@article), allow_other_host: false, notice: is_favourite ? "Добавили в избранное" : "Убрали из избранного" }
      format.json { render json: { favourite: is_favourite } }
    end
  end

  def toggle_reaction
    kind = params[:kind].to_s.downcase
    unless Reaction::KINDS.include?(kind)
      respond_to do |format|
        format.html { redirect_back fallback_location: article_path(@article), alert: "Неизвестная реакция" }
        format.json { render json: { error: "unknown_kind" }, status: :unprocessable_entity }
      end
      return
    end

    scope_attrs = { article: @article, kind: kind }
    if user_signed_in?
      scope_attrs[:user] = current_user
    else
      scope_attrs[:visitor_token] = session.id.to_s.presence || SecureRandom.hex(16)
    end

    existing = Reaction.find_by(scope_attrs)
    if existing
      existing.destroy
    else
      Reaction.create!(scope_attrs)
    end

    respond_to do |format|
      format.html { redirect_back fallback_location: article_path(@article), allow_other_host: false }
      format.json { render json: { reactions: build_reactions_payload(@article) } }
    end
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

  def build_reactions_payload(article)
    counts = Reaction.counts_for(article)
    Reaction::KINDS.map do |kind|
      mine = if user_signed_in?
               article.reactions.where(kind: kind, user_id: current_user.id).exists?
             else
               false
             end
      {
        kind: kind,
        emoji: Reaction::KIND_LABELS[kind],
        count: counts[kind].to_i,
        mine: mine
      }
    end
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
