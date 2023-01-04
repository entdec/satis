# frozen_string_literal: true

module Satis
  class Configuration
    attr_accessor :submit_on_enter, :confirm_before_leave, :base_controller
    attr_writer :default_help_text, :current_user
    attr_writer :logger

    def initialize
      @logger = Logger.new(STDOUT)
      @base_controller = '::ApplicationController'
      @submit_on_enter = true
      @confirm_before_leave = false
      @current_user = -> {}

      @default_help_text = lambda do |_template, _object, key, _additional_scope|
        scope = help_scope(template, object, additional_scope)

        value = I18n.t((["help"] + scope + [key.to_s]).join("."))

        if /translation missing: (.+)/.match?(value)
          nil
        else
          value
        end
      end
    end

    # Config: logger [Object].
    def logger
      @logger.is_a?(Proc) ? instance_exec(&@logger) : @logger
    end

    def default_help_text(template, object, method, additional_scope)
      if @default_help_text.is_a?(Proc)
        instance_exec(template, object, method, additional_scope,
          &@default_help_text)
      else
        @default_help_text
      end
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

    def current_user
      raise 'current_user should be a Proc' unless @current_user.is_a? Proc

      instance_exec(&@current_user)
    end
  end
end
