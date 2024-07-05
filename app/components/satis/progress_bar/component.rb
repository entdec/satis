# frozen_string_literal: true

module Satis
  module ProgressBar
    class Component < Satis::ApplicationComponent
      attr_reader :percentage

      def initialize(percentage, size: :default, label: false)
        super
        @percentage = percentage
        @size = size
        @label = label
      end

      def label
        return if size == :small || size == :default
        if @label.is_a? FalseClass
          ''
        elsif @label.is_a? TrueClass
          "#{percentage}%"
        else
          @label
        end
      end

      def padding
        if @size == :large
          "p-0.5"
        elsif @size == :xlarge
          "p-1"
        end
      end

      def text_size
        if @size == :large
          "text-xs"
        elsif @size == :xlarge
          "text-sm"
        end
      end


      def size
        case @size
        when :small
          "h-1.5"
        when :large
          "h-4"
        when :xlarge
          "h-6"
        else
          "h-2"
        end
      end
    end
  end
end
