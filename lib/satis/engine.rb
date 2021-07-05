require 'satis/forms/builder'
require 'satis/helpers/container'

module Satis
  class Engine < ::Rails::Engine
    isolate_namespace Satis

    config.autoload_paths << "#{root}/app/components"
    config.autoload_paths << "#{root}/lib"

    initializer 'satis.helper' do
      Rails.application.reloader.to_prepare do
        ActiveSupport.on_load :action_view do
          include Satis::ApplicationHelper
        end
      end
    end
  end
end
