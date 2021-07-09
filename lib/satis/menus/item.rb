# frozen_string_literal: true

module Satis
  module Menus
    class Item
      attr_reader :name, :link, :icon, :app, :menu

      def initialize(name, link:, icon: nil, app: nil, &block)
        @name = name
        @icon = icon
        @link = link
        @app = app
        # @app ||= main_app
        @menu = Menu.new(&block) if block_given?
      end
    end
  end
end
