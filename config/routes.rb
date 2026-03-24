Rails.application.routes.draw do
  root "pages#home"

  resources :articles, only: [:index, :show]
  resources :services, only: [:index, :show]

  get "up" => "rails/health#show", as: :rails_health_check
end
