Satis::Engine.routes.draw do
  resources :tables, param: :table_name do
    get 'filter_collection', on: :collection
  end

  resources :user_data_tabs, only: %i[show update]
end
