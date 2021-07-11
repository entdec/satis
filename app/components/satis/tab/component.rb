module Satis
  module Tab
    class Component < Satis::ApplicationComponent
      attr_reader :options, :name, :icon

      def initialize(name, *args, &block)
        super
        @name = name
        @options = args.extract_options!
        @args = args
        @icon = options[:icon]
        @block = block
      end

      def responsive?
        options[:responsive] == true
      end

      def selected?
        options[:selected] == true
      end

      def call
        content
      end
    end
  end
end
