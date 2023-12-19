# frozen_string_literal: true

require 'active_support/concern'

module Satis
  module Concerns
    module ContextualTranslations
      extend ActiveSupport::Concern

      included do
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

          original_view_context.t(key, **options)
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

        def original_virtual_path
          original_view_context.instance_variable_get(:@virtual_path)
        end

        def original_i18n_scope
          original_virtual_path.sub(%r{^/}, '').gsub(%r{/_?}, '.').split('.')
        end

        def i18n_scope
          self.class.name.split('::').second.underscore.to_sym
        end
      end
    end
  end
end