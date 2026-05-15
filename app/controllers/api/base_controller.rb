module Api
  class BaseController < ActionController::API
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
    rescue_from ActionController::ParameterMissing, with: :render_bad_request

    private

    def render_validation_errors(record)
      render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
    end

    def render_bad_request(exception)
      render json: { errors: [exception.message] }, status: :bad_request
    end

    def render_not_found
      render json: { errors: ["Resource not found"] }, status: :not_found
    end

    def find_article_by_api_param
      identifier = (params[:article_id] || params[:id]).to_s
      article = Article.find_by(slug: identifier)
      article ||= Article.find_by(public_uuid: identifier)

      raise ActiveRecord::RecordNotFound unless article

      article
    end

    def visitor_token
      raw_token = request.headers["X-Visitor-Token"].presence || params[:visitor_token].to_s
      token = raw_token.strip
      token.presence || "anonymous"
    end
  end
end
