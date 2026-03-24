Rails.application.routes.draw do
  root "pages#home"
  devise_for :users, controllers: {
    sessions: "users/sessions"
  }
  namespace :api, defaults: { format: :json } do
    get "ping", to: "health#ping"

    devise_scope :user do
      post "login", to: "sessions#create"
      delete "logout", to: "sessions#destroy"
    end
  end

  resources :articles, only: [:index, :show] do
    member do
      post :track_view
    end
  end
  resources :services, only: [:index, :show] do
    collection do
      get :brief
      get :calculator
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  match "/404", to: "errors#not_found", via: :all
end
