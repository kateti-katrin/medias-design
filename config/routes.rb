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

    resources :articles, only: [:index, :show] do
      resource :like, only: [:show, :create, :destroy], controller: "article_likes"
      resources :comments, only: [:index, :create], controller: "article_comments"
    end
  end

  resources :articles, only: [:index, :show] do
    member do
      post :track_view
    end
  end

  resources :services, only: [] do
    collection do
      get :brief
      get :calculator
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  match "/404", to: "errors#not_found", via: :all
end
