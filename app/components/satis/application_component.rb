# frozen_string_literal: true

require 'satis/concerns/contextual_translations'

module Satis
  class ApplicationComponent < ViewComponent::Base
    include ViewComponent::Slotable
    include ActionView::Helpers::TranslationHelper

    attr_accessor :original_view_context

    delegate :add_helper, to: :class

    include Satis::Concerns::ContextualTranslations
    # def original_view_context
    #   @template
    # end

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
