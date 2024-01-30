# frozen_string_literal: true

module Satis
  module Menu
    class Component < Satis::ApplicationComponent
      # renders_many :tabs, Tab::Component
      attr_reader :menu, :icon, :icon_id, :strategy

      def initialize(menu, icon: nil, icon_id: nil, strategy: "fixed")
        super
        @menu = menu
        @icon = icon || "fa-solid fa-ellipsis"
        @icon_id = icon_id
        @strategy = strategy
      end

      def render?
        menu.items.present?
      end
    end
  end
end
