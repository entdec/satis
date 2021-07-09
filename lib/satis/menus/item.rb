# frozen_string_literal: true

module Satis
  module Menus
    class Item
      attr_reader :id, :label, :link, :icon, :app, :menu

      def initialize(id, link:, label: nil, icon: nil, app: nil, link_attributes: nil, &block)
        @id = id
        @label = label
        @icon = icon
        @link = link
        @link_attributes = link_attributes
        @app = app
        # @app ||= main_app
        @menu = Menu.new(&block) if block_given?
      end
    end
  end
end
