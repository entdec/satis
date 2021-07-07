module Satis
  module Switch
    class Component < ViewComponent::Base
      attr_reader :url, :form, :attribute, :icon, :options

      def initialize(form:, attribute:, **options, &block)
        super

        @form = form
        @attribute = attribute
        @options = options
        @block = block
        @icon = true
        @icon = options[:icon] if options.key?(:icon)
      end
    end
  end
end
