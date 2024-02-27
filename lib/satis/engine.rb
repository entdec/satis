require 'satis/forms/builder'
require 'satis/helpers/container'
require 'satis/menus/builder'

require 'view_component'
require 'browser'
require 'browser/aliases'
require 'jsonb_accessor'
require 'slim'
require 'tailwindcss-rails'
require "importmap-rails"
require "turbo-rails"
require "stimulus-rails"

module Satis
  class Engine < ::Rails::Engine
    isolate_namespace Satis

    config.autoload_paths << "#{root}/app/components"
    config.autoload_paths << "#{root}/lib"

    initializer 'satis.assets' do |app|
      app.config.assets.paths << root.join("app/javascript")
      app.config.assets.paths << root.join("app/components")
      app.config.assets.precompile += %w[satis_manifest]
    end

    initializer 'satis.importmap', before: "importmap" do |app|
      app.config.importmap.paths << root.join("config/importmap.rb")
      app.config.importmap.cache_sweepers << root.join("app/javascript")
      app.config.importmap.cache_sweepers << root.join("app/components")
    end

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
