module Api
  class ArticleCommentsController < BaseController
    before_action :set_article

    def index
      comments = @article.comments.includes(:replies).order(created_at: :asc)

      render json: {
        data: comments.map { |comment| comment_payload(comment) }
      }
    end

    def create
      comment = @article.comments.new(comment_params)

      if comment.parent_id.present? && comment.parent&.article_id != @article.id
        return render json: { errors: ["Parent comment must belong to the same article"] }, status: :unprocessable_entity
      end

      if comment.save
        render json: { data: comment_payload(comment) }, status: :created
      else
        render_validation_errors(comment)
      end
    end

    private

    def set_article
      @article = find_article_by_api_param
    end

    def comment_params
      params.require(:comment).permit(:author_name, :body, :parent_id)
    end

    def comment_payload(comment)
      {
        id: comment.id,
        article_id: comment.article_id,
        parent_id: comment.parent_id,
        author_name: comment.author_name,
        body: comment.body,
        created_at: comment.created_at&.iso8601
      }
    end
  end
end
