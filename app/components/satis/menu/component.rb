# frozen_string_literal: true

module Satis
  module Menu
    class Component < Satis::ApplicationComponent
      # renders_many :tabs, Tab::Component
      attr_reader :menu, :icon

      def initialize(menu, icon: nil)
        super
        @menu = menu
        @icon = icon || 'fa-solid fa-ellipsis-vertical'
      end
    end
  end
end
