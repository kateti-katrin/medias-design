module AppSettings
  module_function

  def devise_mailer_sender
    fetch_string(
      env_key: "DEVISE_MAILER_SENDER",
      credentials_path: [:devise, :mailer_sender],
      default: "no-reply@example.com"
    )
  end

  def app_host
    fetch_string(
      env_key: "APP_HOST",
      credentials_path: [:app, :host]
    )
  end

  def jwt_signing_key
    fetch_string(
      env_key: "JWT_SIGNING_KEY",
      credentials_path: [:jwt, :signing_key],
      default: Rails.application.secret_key_base
    )
  end

  def cors_allowed_origins
    raw = ENV["CORS_ALLOWED_ORIGINS"].presence ||
          Rails.application.credentials.dig(:cors, :allowed_origins)

    values =
      case raw
      when String
        raw.split(",")
      when Array
        raw
      else
        []
      end

    sanitized = values.map { |v| v.to_s.strip }.reject(&:blank?)
    sanitized.presence || ["http://localhost:3000"]
  end

  def fetch_string(env_key:, credentials_path:, default: nil)
    value = ENV[env_key].presence || Rails.application.credentials.dig(*credentials_path).presence || default
    value.is_a?(String) ? value.strip.presence : value
  end
end
