Satis::Engine.routes.draw do
  resources :user_data, only: %i[show update]
  namespace :showcases do
    resources :avatars
  end
end
