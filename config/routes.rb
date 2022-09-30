Satis::Engine.routes.draw do
  resources :tables, param: :table_name do
    get 'filter_collection', on: :collection
  end

  resources :user_data, only: %i[show update]
end
