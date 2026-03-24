module Api
  class HealthController < BaseController
    def ping
      render json: { status: "ok", service: "api", timestamp: Time.current.iso8601 }
    end
  end
end
