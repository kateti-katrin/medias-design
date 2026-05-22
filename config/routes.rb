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
      resource :favourite, only: [:create, :destroy], controller: "favourites"
      resources :reactions, only: [:index, :create]
    end

    resources :favourites, only: [:index], controller: "favourites"

    get "profile", to: "profile#show"
  end

  resources :articles, only: [:index, :show] do
    member do
      post :track_view
      get :toggle_favourite
      get "toggle_reaction/:kind", to: "articles#toggle_reaction", as: "toggle_reaction"
    end
  end

  resources :favourites, only: [:index], controller: "favourites"
  get "profile", to: "profile#show"
  get "profile/edit", to: "profile#edit", as: :edit_profile
  patch "profile", to: "profile#update"

  resources :services, only: [] do
    collection do
      get :brief
      get :calculator
    end
  end

  get "pricing", to: "pricing#show", as: :pricing

  get "up" => "rails/health#show", as: :rails_health_check

  match "/404", to: "errors#not_found", via: :all
end
