module Satis
  module Tab
    class Component < Satis::ApplicationComponent
      attr_reader :name, :options

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
    end
  end
end
