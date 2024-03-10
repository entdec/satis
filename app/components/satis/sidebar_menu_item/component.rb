# frozen_string_literal: true

module Satis
  module SidebarMenuItem
    class Component < Satis::ApplicationComponent
      with_collection_parameter :item
      attr_reader :item, :menu_options

      # renders_many :items
      def initialize(**options)
        @item = options[:item]
        @menu_options = options.fetch(:menu_options, {})
        @actions = item.link_attributes.delete(:'data-action')
      end

      def data_actions
        "click->satis-sidebar-menu-item#open #{@actions}"
      end
    end
  end
end
