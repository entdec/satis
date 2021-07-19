module Satis
  module InfoItem
    class Component < Satis::ApplicationComponent
      attr_reader :options, :name, :icon

      def initialize(name, *args, &block)
        super
        @name = name
        @options = args.extract_options!
        @args = args
        @icon = options[:icon]
      end
    end
  end
end
