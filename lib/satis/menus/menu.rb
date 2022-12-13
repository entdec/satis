# frozen_string_literal: true

module Satis
  module Menus
    class Menu
      attr_reader :items, :level, :event
      def initialize(*args, **kwargs)
        @options = args.extract_options!
        @items = []
        @scope = Array.wrap(args.first)
        @level = kwargs[:level] || 0
        @event = "mouseover->satis-menu#show mouseleave->satis-menu#hide"
        yield self if block_given?
      end

      def item(*args, **kwargs, &block)
        kwargs[:scope] = @scope
        kwargs[:level] = @level
        @items << Item.new(*args, **kwargs, &block)
        @event = @scope.include?(:filter_menu) || @scope.include?(:view_menu) ?  "click->satis-menu#show mouseleave->satis-menu#hide" : "mouseover->satis-menu#show mouseleave->satis-menu#hide"
      end
    end
  end
end
