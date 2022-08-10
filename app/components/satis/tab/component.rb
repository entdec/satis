# frozen_string_literal: true

module Satis
  module Tab
    class Component < Satis::ApplicationComponent
      attr_reader :options, :name, :icon, :badge, :disable_i18n

      def initialize(name, *args, &block)
        super
        @name = name
        @options = args.extract_options!
        @args = args
        @icon = options[:icon]
        @badge = options[:badge]
        @disable_i18n = options[:disable_i18n]
        @block = block
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
