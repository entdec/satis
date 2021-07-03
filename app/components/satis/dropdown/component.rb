module Satis
  module Dropdown
    class Component < ViewComponent::Base
      attr_reader :url, :form, :attribute, :title, :options

      def initialize(form:, attribute:, **options, &block)
        @form = form
        @attribute = attribute
        @title = title
        @options = options
        @url = options[:url]
        @block = block
      end

      def placeholder
        title || attribute.to_s.humanize
      end

      def value_method
        options[:value_method] || :id
      end

      def text_method
        options[:text_method] || :name
      end

      def custom_item_html?
        !!@block
      end

      def item_html(item)
        form.template.capture { @block.call(item) }
      end
    end
  end
end
