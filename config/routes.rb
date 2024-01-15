Satis::Engine.routes.draw do
  resources :user_data, only: %i[show update]

  unless Rails.env.production?
    namespace :documentation do
      resources :avatars
      resources :cards
      resources :forms do
        get "select", on: :collection
      end
    end
    resources :documentation
  end
end
