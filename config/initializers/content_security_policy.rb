# Be sure to restart your server when you modify this file.
#
# Application-wide Content Security Policy.
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self
    policy.font_src    :self, :https, :data, "https://fonts.gstatic.com"
    policy.img_src     :self, :https, :data
    policy.object_src  :none
    policy.script_src  :self
    policy.style_src   :self, :https, "https://fonts.googleapis.com"
    policy.connect_src :self
    policy.frame_ancestors :none
    policy.base_uri    :self
    policy.form_action :self
  end

  # В dev оставляем report-only, чтобы случайно не сломать рабочий процесс.
  config.content_security_policy_report_only = Rails.env.development?
end
