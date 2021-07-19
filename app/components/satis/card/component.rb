module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions
      renders_one :footer

      attr_reader :icon, :title, :description, :menu, :body_html

      def initialize(icon: nil, title: nil, description: nil, menu: nil, body_html: {})
        super
        @title = title
        @description = description
        @icon = icon
        @menu = menu
        @body_html = body_html
        body_html[:class] = 'px-6 py-6' unless @body_html.key? :class
      end
    end
  end
end
