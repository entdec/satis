module Satis
  module Tab
    class Component < Satis::ApplicationComponent
      attr_reader :options, :name

      def initialize(name, *args, &block)
        super
        @name = name
        @options = args.extract_options!
        @args = args
        @block = block
      end

      def responsive?
        options[:responsive] == true
      end

      def selected?
        options[:selected] == true
      end

      def content
        # FIXME: This is not actual api
        @_content_block.call if @_content_block
      end

      def render
        nil
      end
    end
  end
end
