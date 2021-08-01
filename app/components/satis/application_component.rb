module Satis
  class ApplicationComponent < ViewComponent::Base
    include ViewComponent::SlotableV2
    include ActionView::Helpers::TranslationHelper

    attr_accessor :original_view_context

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
    def ct(key = nil, **options)
      scope = Array.wrap(options.delete(:scope))

      scope = if scope
                scope.unshift(i18n_scope)
              else
                [i18n_scope]
              end

      scope = original_i18n_scope.concat(scope)

      key = key&.to_s unless key.is_a?(String)
      key = "#{scope.join('.')}#{key}" if key.start_with?('.')

      original_view_context.t(key, **options)
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
