module Api
  class ArticleLikesController < BaseController
    before_action :set_article

    def show
      render json: like_state_payload
    end

    def create
      like = @article.likes.find_or_initialize_by(visitor_token: visitor_token)

      if like.persisted?
        return render json: like_state_payload
      end

      if like.save
        render json: like_state_payload, status: :created
      else
        render_validation_errors(like)
      end
    end

    def destroy
      like = @article.likes.find_by(visitor_token: visitor_token)
      like&.destroy

      render json: like_state_payload
    end

    private

    def set_article
      @article = find_article_by_api_param
    end

    def like_state_payload
      {
        data: {
          article_id: @article.id,
          visitor_token: visitor_token,
          liked: @article.likes.exists?(visitor_token: visitor_token),
          likes_count: @article.likes.count
        }
      }
    end
  end
end
