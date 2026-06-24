# frozen_string_literal: true

require 'active_support/concern'

module Satis
  module Concerns
    module ContextualTranslations
      extend ActiveSupport::Concern

      included do
        attr_accessor :original_virtual_path

        #
        # This provides us with a translation helper which scopes into the original view
        # and thereby conveniently scopes the translations.
        #
        # In your component.html.slim you can use:
        # ```slim
        # = ct(".#{tab.name}", scope: [group.to_sym])
        # ````
        #
        # It'll then try and find a translation with scope: en.admin.spaces.edit.tabs.main.admin_versions
        #
        # NOTE: Add your own original_view_context method to refer to the original view context,
        #       for components this is @template
        #
        def ct(key = nil, **options)
          key = "#{full_i18n_scope(options).join('.')}#{key}" if key.start_with?('.')
          original_view_context.controller.t(key, **options, default: options[:default] || key.to_s.split(".").last.humanize)
        end

        def full_i18n_scope(options = {})
          # NOTE: Caching this screws up the order
          # return @full_i18n_scope if @full_i18n_scope

          @full_i18n_scope = original_i18n_scope
          @full_i18n_scope += Array.wrap(i18n_scope)
          @full_i18n_scope += Array.wrap(@scope) if @scope
          @full_i18n_scope += Array.wrap(options.delete(:scope))
          @full_i18n_scope.flatten.compact!

          @full_i18n_scope
        end

        def original_i18n_scope
          virtual_path = original_virtual_path.presence || original_view_context_virtual_path

          return virtual_path.gsub(%r{/_?}, ".").split(".") if virtual_path.present? && !satis_component_virtual_path?(virtual_path)

          [original_view_context.controller_path.tr("/", "."), original_view_context.action_name]
        end

        def satis_component_virtual_path?(virtual_path)
          virtual_path.start_with?("satis/")
        end

        def original_view_context_virtual_path
          if original_view_context.respond_to?(:virtual_path)
            original_view_context.virtual_path
          elsif original_view_context.instance_variable_defined?(:@virtual_path)
            original_view_context.instance_variable_get(:@virtual_path)
          end
        end

        def i18n_scope
          self.class.name.split('::').second.underscore.to_sym
        end
      end
    end
  end
end
