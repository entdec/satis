Satis::Engine.routes.draw do
  resources :user_data, only: %i[show update]
  resources :dialogs, only: %[show]

  unless Rails.env.production?
    namespace :documentation do
      resources :avatars
      resources :cards
      resources :editors
      resources :forms do
        get "select", on: :collection
      end
      resources :tabs
    end
    resources :documentation
  end
end
