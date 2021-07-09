# frozen_string_literal: true

module Satis
  module Menus
    class Menu
      attr_reader :items

      def initialize(*args)
        @options = args.extract_options!
        @items = []
        yield self if block_given?
      end

      def item(*args, &block)
        @items << Item.new(*args, &block)
      end
    end
  end
end
