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
        'click->satis-sidebar-menu-item#open'
      end
    end
  end
end
