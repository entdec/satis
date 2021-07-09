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

      def item(name, link:, icon: nil, app: nil, &block)
        @items << Item.new(name, link: link, icon: icon, app: app, &block)
      end
    end
  end
end
