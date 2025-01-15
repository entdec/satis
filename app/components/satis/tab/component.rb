# frozen_string_literal: true

module Satis
  module Tab
    class Component < Satis::ApplicationComponent
      attr_reader :name, :icon, :badge, :id, :tab_menu, :menu,
                  :selected, :dirty, :padding, :title, :responsive, :options, :selected_tab_index

      def initialize(name = nil,
                     icon: nil,
                     badge: nil,
                     id: nil,
                     tab_menu: nil,
                     menu: nil,
                     padding: false,
                     dirty: false,
                     title: nil,
                     responsive: false,
                     options: nil,
                     selected_tab_index: nil,
                     selected: false,
                     &block)
        super

        @name = name
        @icon = icon
        @id = id || name.to_s.underscore
        @badge = badge
        @padding = padding
        @dirty = dirty
        @title = title
        @responsive = responsive
        @selected = selected

        @menu = menu
        # FIXME: Obsolete these
        if tab_menu.present?
          @menu ||= tab_menu
          Satis::Deprecation.warn('Calling tab with the tab_menu parameter, use menu instead')
        end

        if selected_tab_index.present?
          @selected_tab_index = selected_tab_index # use selected
          Satis::Deprecation.warn('Calling tab with the selected_tab_index parameter, use selected instead')
        end

        @block = block
      end

      def responsive?
        responsive == true
      end

      def selected?
        selected == true
      end

      def dirty?
        dirty == true
      end

      def call
        content
      end
    end
  end
end
