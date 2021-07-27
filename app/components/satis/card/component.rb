module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions
      renders_many :tabs, Tab::Component
      renders_one :footer

      attr_reader :icon, :title, :description, :menu, :content_padding, :header_background_color

      def initialize(icon: nil, title: nil, description: nil, menu: nil, content_padding: true,
                     header_background_color: {
                       dark: 'bg-gray-800', light: 'bg-white'
                     })
        super
        @title = title
        @title = @title.join(' ') if @title.is_a?(Array)
        @description = description
        @icon = icon
        @menu = menu
        @content_padding = content_padding
        @header_background_color = header_background_color
      end

      def tabs?
        tabs.present?
      end

      def header?
        icon.present? || title.present? || description.present? || menu
      end
    end
  end
end
