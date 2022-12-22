Satis::Engine.routes.draw do
  resources :user_data, only: %i[show update]
end
