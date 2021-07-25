module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions
      renders_many :tabs, Tab::Component
      renders_one :footer

      attr_reader :icon, :title, :description, :menu, :content_padding

      def initialize(icon: nil, title: nil, description: nil, menu: nil, content_padding: true)
        super
        @title = title
        @description = description
        @icon = icon
        @menu = menu
        @content_padding = content_padding
      end

      def tabs?
        tabs.present?
      end
    end
  end
end
