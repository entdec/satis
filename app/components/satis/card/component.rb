module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions

      attr_reader :icon, :title, :description, :menu

      def initialize(icon: nil, title: nil, description: nil, menu: nil)
        super
        @title = title
        @description = description
        @icon = icon
        @menu = menu
      end
    end
  end
end
