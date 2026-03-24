class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    nested_profile = [:id, :display_name, :bio, :avatar_url]

    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: [:email, :password, :password_confirmation, { profile_attributes: nested_profile }]
    )

    devise_parameter_sanitizer.permit(
      :account_update,
      keys: [:email, :password, :password_confirmation, :current_password, { profile_attributes: nested_profile }]
    )
  end
end
