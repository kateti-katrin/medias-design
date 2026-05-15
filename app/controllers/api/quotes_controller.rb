module Api
  class QuotesController < BaseController
    def create
      params_hash = quote_params.to_h.symbolize_keys
      result = QuoteCalculator.call(params_hash)

      Lead.create!(
        kind: "quote",
        contact_email: contact_params[:contact_email],
        contact_name: contact_params[:contact_name],
        payload: params_hash,
        result: result,
        amount_min_cents: (result.dig(:freelancer, :min).to_i * 100),
        amount_max_cents: (result.dig(:agency, :max).to_i * 100),
        duration_weeks: result.dig(:freelancer, :weeks),
        ip_address: request.remote_ip,
        user_agent: request.user_agent.to_s[0, 500]
      )

      render json: result, status: :created
    end

    private

    def quote_params
      params.require(:quote).permit(:type, :pages, :brandbook, :copywriting, :analytics, :urgency)
    end

    def contact_params
      params.fetch(:contact, {}).permit(:contact_email, :contact_name)
    end
  end
end
