# frozen_string_literal: true

module Satis
  module Menus
    class Menu
      attr_reader :items, :level

      def initialize(*args, level: 0)
        @options = args.extract_options!
        @items = []
        @scope = Array.wrap(args.first)
        @level = level
        yield self if block_given?
      end

      def item(*args, &block)
        args.last[:scope] = @scope
        args.last[:level] = @level
        @items << Item.new(*args, &block)
      end
    end
  end
end
