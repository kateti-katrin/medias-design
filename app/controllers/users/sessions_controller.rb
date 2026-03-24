module Users
  class SessionsController < Devise::SessionsController
    def destroy
      signed_out = if Devise.sign_out_all_scopes
                     sign_out
                   else
                     sign_out(resource_name)
                   end

      set_flash_message! :notice, :signed_out if signed_out
      yield if block_given?

      redirect_back fallback_location: root_path, allow_other_host: false
    end
  end
end
