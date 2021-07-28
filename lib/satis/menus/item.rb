# frozen_string_literal: true

module Satis
  module Menus
    class Item
      attr_reader :id, :link, :icon, :app, :menu, :link_attributes, :level

      attr_writer :scope

      def initialize(id, link: nil, label: nil, icon: nil, link_attributes: {}, scope: [], level: nil, &block)
        @id = id
        @label = label
        @icon = icon
        @link = link
        @link_attributes = link_attributes
        @scope = scope
        @level = level
        @menu = Menu.new(scope + ["#{id}_menu".to_sym], level: level + 1, &block) if block_given?
      end

      def label
        @label || I18n.t(id, scope: [:menu] + @scope, default: id.to_s.humanize)
      end
    end
  end
end
