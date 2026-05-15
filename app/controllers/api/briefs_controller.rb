module Api
  class BriefsController < BaseController
    def create
      params_hash = brief_params.to_h.symbolize_keys
      result = BriefBuilder.call(params_hash)

      Lead.create!(
        kind: "brief",
        contact_email: contact_params[:contact_email],
        contact_name: contact_params[:contact_name],
        payload: result[:normalized],
        result: { text: result[:text] },
        ip_address: request.remote_ip,
        user_agent: request.user_agent.to_s[0, 500]
      )

      render json: { text: result[:text] }, status: :created
    end

    private

    def brief_params
      params.require(:brief).permit(:projectType, :goal, :audience, :cta, :brand, :blocks, :deadline, :notes)
    end

    def contact_params
      params.fetch(:contact, {}).permit(:contact_email, :contact_name)
    end
  end
end
