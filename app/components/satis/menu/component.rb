# frozen_string_literal: true

module Satis
  module Menu
    class Component < Satis::ApplicationComponent
      # renders_many :tabs, Tab::Component
      attr_reader :menu, :icon, :selected_column

      def initialize(menu, icon: nil, selected_column: nil)
        super
        @menu = menu
        @icon = icon || 'fa-solid fa-ellipsis-vertical'
        @selected_column = selected_column
      end
    end
  end
end
