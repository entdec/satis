# frozen_string_literal: true

module Satis
  module SidebarMenuItem
    class Component < Satis::ApplicationComponent
      attr_reader :item, :menu_options

      # renders_many :items
      def initialize(**options)
        @item = options[:item]
        @menu_options = options.fetch(:menu_options, {})
      end

      def data_actions
        return unless open_on_hover?

        'mouseenter->satis-sidebar-menu-item#open mouseleave->satis-sidebar-menu-item#close'
      end

      def open_on_hover?
        menu_options.fetch(:open_on_hover, true)
      end
    end
  end
end
