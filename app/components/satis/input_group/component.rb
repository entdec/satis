module Satis
  module InputGroup
    class Component < Satis::ApplicationComponent
      attr_reader :form, :attribute, :options

      renders_one :prefix

      def initialize(form:, attribute:, **options, &block)
        super

        @form = form
        @attribute = attribute
        @options = options
        @block = block
        options[:input_html] ||= {}
      end

      def item_html
        form.template.capture { @block.call(self) }
      end
    end
  end
end
