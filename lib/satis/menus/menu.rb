# frozen_string_literal: true

module Satis
  module Menus
    class Menu
      attr_reader :items, :level, :event, :show_scroll
      def initialize(*args, **kwargs)
        @options = args.extract_options!
        @items = []
        @scope = Array.wrap(args.first)
        @level = kwargs[:level] || 0
        @event = kwargs[:event] || 'mouseover'
        @show_scroll = kwargs[:show_scroll] || false
        yield self if block_given?
      end

      def item(*args, **kwargs, &block)
        kwargs[:scope] = @scope
        kwargs[:level] = @level
        @items << Item.new(*args, **kwargs, &block)
      end
    end
  end
end
