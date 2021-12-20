# frozen_string_literal: true

module Satis
  module InfoItem
    class Component < Satis::ApplicationComponent
      attr_reader :options, :name, :icon, :group

      def initialize(name, *args, &block)
        super
        @name = name
        @args = args
        @options = args.extract_options!
        @group = options[:group]
        @icon = options[:icon]
        @placeholder = options[:placeholder] || '—'
      end
    end
  end
end
