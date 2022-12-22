# frozen_string_literal: true

module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions
      renders_many :tabs, Tab::Component
      renders_one :footer

      attr_reader :icon, :title, :description, :menu, :content_padding, :header_background_color, :initial_actions, :key, :custom_tabs_link_html

      def initialize(icon: nil,
                     title: nil,
                     description: nil,
                     menu: nil,
                     content_padding: true,
                     header_background_color: {
                       dark: 'bg-gray-800', light: 'bg-white'
                     },
                     actions: [],
                     key: nil)
        super
        @title = title
        @title = @title.reject(&:blank?).compact.join(' ') if @title.is_a?(Array)
        @description = description
        @icon = icon
        @menu = menu
        @content_padding = content_padding
        @header_background_color = header_background_color
        @initial_actions = actions
        @key = key
      end

      def custom_tabs_link(&block)
        return unless block_given?
        @custom_tabs_link_html = block.call.html_safe
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
