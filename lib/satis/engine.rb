require 'satis/forms/builder'
require 'satis/helpers/container'
require 'satis/menus/builder'



module Satis
  class Engine < ::Rails::Engine
    isolate_namespace Satis

    config.autoload_paths << "#{root}/app/components"
    config.autoload_paths << "#{root}/lib"

    initializer 'satis.helper' do
      Rails.application.reloader.to_prepare do
        ActiveSupport.on_load :action_view do
          include Satis::ApplicationHelper

          # F*CK Rails, adding an extra surrounding div 'field_with_errors' breaking all the things.
          self.field_error_proc = ->(html_tag, _instance) { html_tag }
        end

        ActiveSupport.on_load(:action_controller) do
          include Satis::ActionControllerHelpers
        end
      end
    end
  end
end
