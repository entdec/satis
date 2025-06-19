# frozen_string_literal: true

module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions
      renders_many :tabs, Tab::Component
      renders_one :footer

      attr_reader :identifier, :icon, :description, :menu, :content_padding, :header_background_color, :initial_actions, :persist, :key
      attr_writer :scope

      def initialize(identifier = nil,
                     icon: nil,
                     title: nil,
                     description: nil,
                     menu: nil,
                     content_padding: true,
                     header_background_color: {
                       dark: 'bg-gray-800', light: 'bg-white'
                     },
                     custom_tabs_link: nil,
                     scope: [],
                     actions: [],
                     key: nil,
                     persist: true)
        super

        if identifier.blank?
          Satis::Deprecation.warn('Calling sts.card with the id parameter will become mandatory')
        end

        @identifier = identifier
        @title = title
        @title = @title.reject(&:blank?).compact.join(' ') if @title.is_a?(Array)
        @description = description
        @icon = icon
        @menu = menu
        @content_padding = content_padding
        @header_background_color = header_background_color
        @initial_actions = actions
        @persist = persist
        @key = key
        @custom_tabs_link = custom_tabs_link
        @scope = scope.present? ? scope : identifier
      end

      # def key
      #   return unless @persist
      #
      #   @key ||= identifier.to_s.parameterize.underscore if identifier.present?
      #   @key ||=  strip_tags(@title)&.parameterize&.underscore
      #
      #   [controller_name, action_name, params[:id], @key, 'tab'].compact.join('_')
      # end

      def title
        return @title if @title

        @title ||= ct('.title')
      end

      def custom_tabs_link(&block)
        return @custom_tabs_link unless block_given?

        @custom_tabs_link = block.call
        # @custom_tabs_link_html = block.call.html_safe
      end

      def header?
        icon.present? || title.present? || description.present? || menu
      end
    end
  end
end
