# frozen_string_literal: true

module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions
      renders_many :tabs, Tab::Component
      renders_one :footer

      attr_reader :id, :icon, :description, :menu, :content_padding, :header_background_color, :initial_actions, :custom_tabs_link_html
      attr_writer :scope

      def initialize(id = nil,
                     icon: nil,
                     title: nil,
                     description: nil,
                     menu: nil,
                     content_padding: true,
                     header_background_color: {
                       dark: 'bg-gray-800', light: 'bg-white'
                     },
                     scope: [],
                     actions: [],
                     key: nil,
                     persist: true)
        super

        if id.blank?
          ActiveSupport::Deprecation.warn('Calling sts.card with the id parameter will become mandatory')
        end

        @id = id
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
        @scope = scope
      end

      def key
        return unless @persist

        @key ||= id.to_s.parameterize.underscore if id.present?
        @title = strip_tags(@title)
        @key ||= @title&.parameterize&.underscore

        [controller_name, action_name, params[:id], @key, 'tab'].compact.join('_')
      end

      def title
        return @title if @title

        @title ||= I18n.t(id, scope: [:card] + @scope, default: id.to_s.humanize)
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
