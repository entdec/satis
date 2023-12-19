# frozen_string_literal: true

module Satis
  class ApplicationComponent < ViewComponent::Base
    include ViewComponent::Slotable
    include ActionView::Helpers::TranslationHelper

    attr_accessor :original_view_context

    delegate :add_helper, to: :class


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
      key = "#{full_i18n_scope(options).join('.')}#{key}" if key.start_with?('.')
      Rails.logger.warn("key: #{key}")

      original_view_context.t(key, **options)
    end

    def full_i18n_scope(options = {})
      return @full_i18n_scope if @full_i18n_scope

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

    def component_name
      self.class.name.sub(/::Component$/, "").sub(/^Satis::/, "").underscore
    end

    def self.add_helper(name, component)
      if respond_to?(name)
        Satis.config.logger.warn("Helper #{name} already defined, skipping.")
        return
      end
      define_method(name) do |*args, **kwargs, &block|
        original_args = args.dup
        options = args.extract_options!
        instance = if options.key? :variant
          variant_component = component.to_s.sub(/::Component$/, "::#{options[:variant].to_s.camelize}::Component").safe_constantize
          (variant_component || component).new(*original_args, **kwargs)
        else
          kwargs[component_name.to_sym] = self
          component.new(*original_args, **kwargs)
        end
        original_view_context.render(instance, &block)
      end
    end

  end
end
