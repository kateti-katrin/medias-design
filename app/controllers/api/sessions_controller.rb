module Api
  class SessionsController < Devise::SessionsController
    respond_to :json
    skip_before_action :verify_authenticity_token

    private

    def respond_with(resource, _opts = {})
      render json: {
        status: { code: 200, message: "signed_in" },
        data: {
          id: resource.id,
          email: resource.email
        }
      }, status: :ok
    end

    def respond_to_on_destroy
      render json: {
        status: 200,
        message: "signed_out"
      }, status: :ok
    end
  end
end
