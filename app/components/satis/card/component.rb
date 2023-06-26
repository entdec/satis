# frozen_string_literal: true

module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions
      renders_many :tabs, Tab::Component
      renders_one :footer

      attr_reader :icon, :title, :description, :menu, :content_padding, :header_background_color, :initial_actions, :key, :custom_tabs_link_html

      def before_render
        @key = [controller_name, action_name, self.title.downcase, 'tab'].compact.join('_') if @persist
      end
      def initialize(icon: nil,
                     title: nil,
                     description: nil,
                     menu: nil,
                     content_padding: true,
                     header_background_color: {
                       dark: 'bg-gray-800', light: 'bg-white'
                     },
                     actions: [],
                     key: nil,
                     persist: true)
        super
        @title = title
        @title = @title.reject(&:blank?).compact.join(' ') if @title.is_a?(Array)
        @description = description
        @icon = icon
        @menu = menu
        @content_padding = content_padding
        @header_background_color = header_background_color
        @initial_actions = actions
        @persist = persist
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
