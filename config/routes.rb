Satis::Engine.routes.draw do
  resources :user_data, only: %i[show update]
  namespace :documentation do
    resources :avatars
    resources :cards
    resources :forms
  end
  resources :documentation
end
