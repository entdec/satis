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

      def string_contents
        @content = options[:content]
        @content = @content.call if @content.respond_to?(:call)

        case @content.presence
        when Time
          @content.strftime('%Y-%m-%d %H:%M')
        when ActiveRecord::Base
          @content.try(:human_name) || @content.try(:name) || "#{@content.class} ##{@content.id}"
        when Symbol
          @content.to_s.humanize
        when ActiveSupport::SafeBuffer
          @content
        when nil
          @placeholder
        else
          @content
        end
      end

      def class_name
        "satis-info-item #{group}-info-item #{css_class_for_name}-info-item #{options[:class]}"
      end

      private

      def css_class_for_name
        name.to_s.dasherize
      end
    end
  end
end
