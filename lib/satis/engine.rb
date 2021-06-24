require 'satis/forms/builder'
require 'satis/helpers/container'

module Satis
  class Engine < ::Rails::Engine
    isolate_namespace Satis

    config.autoload_once_paths = %W[
      #{root}/app/components
    ]

    initializer 'satis.helper' do
      ActiveSupport.on_load :action_view do
        include Satis::ApplicationHelper
      end
    end
  end
end
