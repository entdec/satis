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

      def call
        content
      end
    end
  end
end
