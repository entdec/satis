# frozen_string_literal: true

module Satis
  module Tab
    class Component < Satis::ApplicationComponent
      attr_reader :options, :name, :icon, :badge, :id, :tab_menu, :selected_tab_index

      def initialize(name, *args, &block)
        super
        @name = name
        @options = args.extract_options!
        @args = args
        @icon = options[:icon]
        @id = options[:id]
        @badge = options[:badge]
        @tab_menu = options[:tab_menu]
        @block = block
        @selected_tab_index = options[:selected_tab_index]
      end

      def responsive?
        options[:responsive] == true
      end

      def selected?
        options[:selected] == true
      end

      def title
        options[:title]
      end

      def call
        content
      end
    end
  end
end
