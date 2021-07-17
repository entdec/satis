Satis::Engine.routes.draw do
  resources :tables do
    get 'filter_collection', on: :collection
  end
end
