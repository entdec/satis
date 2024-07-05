Rails.application.routes.draw do
  mount Satis::Engine => '/'
  root to: redirect { Satis::Engine.routes.url_helpers.documentation_index_path }
end
