module Satis
  module MenuItem
    class Component < Satis::ApplicationComponent
      attr_reader :item

      # renders_many :items
      def initialize(**options)
        @item = options[:item]
      end
    end
  end
end