# frozen_string_literal: true

module Satis
  module Menu
    class Component < Satis::ApplicationComponent
      # renders_many :tabs, Tab::Component
      attr_reader :menu, :icon, :icon_id

      def initialize(menu, icon: nil, icon_id: nil)
        super
        @menu = menu
        @icon = icon || "fa-solid fa-ellipsis"
        @icon_id = icon_id
      end
    end
  end
end
