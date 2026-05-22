module Api
  class ReactionsController < BaseController
    def index
      article = find_article_by_api_param
      render json: build_payload(article)
    end

    def create
      article = find_article_by_api_param
      kind = params[:kind].to_s.downcase
      unless Reaction::KINDS.include?(kind)
        return render json: { errors: ["Unknown reaction kind"] }, status: :unprocessable_entity
      end

      reaction = find_or_initialize_reaction(article, kind)

      if reaction.persisted?
        reaction.destroy
        render json: build_payload(article).merge(toggled: "off")
      else
        reaction.save!
        render json: build_payload(article).merge(toggled: "on"), status: :created
      end
    end

    private

    def find_or_initialize_reaction(article, kind)
      base = { article: article, kind: kind }
      if current_user
        article.reactions.find_or_initialize_by(base.merge(user: current_user))
      else
        article.reactions.find_or_initialize_by(base.merge(visitor_token: visitor_token))
      end
    end

    def build_payload(article)
      counts = Reaction.counts_for(article)
      kinds = Reaction::KINDS.map do |kind|
        {
          kind: kind,
          emoji: Reaction::KIND_LABELS[kind],
          count: counts[kind].to_i,
          mine: kind_owned_by_me?(article, kind)
        }
      end
      {
        article_id: article.id,
        total: counts.values.sum,
        kinds: kinds
      }
    end

    def kind_owned_by_me?(article, kind)
      scope = article.reactions.where(kind: kind)
      if current_user
        scope.where(user_id: current_user.id).exists?
      else
        scope.where(visitor_token: visitor_token).exists?
      end
    end
  end
end
