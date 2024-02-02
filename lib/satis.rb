require 'satis/version'
require 'satis/engine'
require 'satis/configuration'
require 'satis/active_record_helpers'

require 'view_component'
require 'browser'
require 'browser/aliases'
require 'jsonb_accessor'

Browser::Base.include(Browser::Aliases)

module Satis
  extend Configurable

  class << self

    def confirm_before_leave?
      return false if config.nil?

      config.confirm_before_leave
    end

    def submit_on_enter?
      return true if config.nil?

      config.submit_on_enter
    end

    def add_helper(name, component)
      Satis::Helpers::Container.add_helper(name, component)
    end

    def add_component_helper(component_name, name, component)
      klass = "Satis::#{component_name.to_s.classify}::Component".safe_constantize
      return if klass.blank?
      klass.add_helper name, component
    end
  end

  # Include helpers
  ActiveSupport.on_load(:active_record) do
    include Satis::ActiveRecordHelpers
  end
end
