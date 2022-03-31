# frozen_string_literal: true

module Satis
  class Configuration
    attr_accessor :submit_on_enter, :confirm_before_leave
    attr_writer :default_help_text

    def initialize
      @submit_on_enter = true
      @confirm_before_leave = false

      @default_help_text = lambda do |_template, _object, key, _additional_scope|
        scope = help_scope(template, object, additional_scope)

        value = I18n.t((['help'] + scope + [key.to_s]).join('.'))

        if value.match(/translation missing: (.+)/)
          nil
        else
          value
        end
      end
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
    def help_scope(template, object, additional_scope)
      scope = template.controller.controller_path.split('/')
      scope << template.controller.action_name
      scope << object.class.name.demodulize.tableize.singularize

      scope += Array.wrap(additional_scope) if additional_scope

      scope.map(&:to_s)
    end
  end
end
