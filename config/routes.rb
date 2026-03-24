Rails.application.routes.draw do
  root "pages#home"

  resources :articles, only: [:index, :show]
  resources :services, only: [:index, :show] do
    collection do
      get :brief
      get :calculator
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  match "/404", to: "errors#not_found", via: :all
end
