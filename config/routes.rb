Satis::Engine.routes.draw do
  resources :user_data, only: %i[show update]

  if Rails.env.development? || Rails.env.test?
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
