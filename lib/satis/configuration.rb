# frozen_string_literal: true

module Satis
  module Options
    module ClassMethods
      def option(name, default: nil)
        attr_accessor(name)
        schema[name] = default
      end

      def schema
        @schema ||= {}
      end
    end

    def set_defaults!
      self.class.schema.each do |name, default|
        instance_variable_set("@#{name}", default)
      end
    end

    def self.included(cls)
      cls.extend(ClassMethods)
    end
  end

  class Configuration
    include Options

    option :full_width_topbar, default: false
    option :logger, default: Rails.logger
    option :submit_on_enter, default: true
    option :confirm_before_leave, default: false
    option :current_user, default: lambda {}

    option(:default_help_text, default: lambda do |template, object, key, additional_scope|
      scope = help_scope(template, object, additional_scope)

      value = I18n.t((["help"] + scope + [key.to_s]).join("."))

      if /translation missing: (.+)/.match?(value)
        nil
      else
        value
      end
    end)

    def initialize
      set_defaults!
    end

    # Maybe not the right place?
    def help_scope(template, object, additional_scope, action: nil)
      scope = template.controller.controller_path.split("/")
      scope << (action || template.controller.action_name)
      scope << object.class.name.demodulize.tableize.singularize

      scope += Array.wrap(additional_scope) if additional_scope

      scope.map(&:to_s)
    end

    def help_scopes(template, object, additional_scope)
      actions = [template.controller.action_name]
      %w[show new edit create update destroy index].each do |action|
        actions << action unless actions.include?(action)
      end

      actions.map { |action| help_scope(template, object, additional_scope, action: action) }
    end
  end

  module Configurable
    attr_writer :config

    def config
      @config ||= Configuration.new
    end

    def configure
      yield(config)
    end
    alias setup configure

    def reset_config!
      @config = Configuration.new
    end
  end
end
