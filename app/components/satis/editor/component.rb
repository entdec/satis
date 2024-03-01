# frozen_string_literal: true

module Satis
  module Editor
    class Component < ApplicationComponent
      attr_reader :form, :attribute, :options
      def initialize(form: nil, attribute: nil, **options)
        @form = form
        @attribute = attribute
        @options = options
      end

      def readonly?
        (@options[:readonly].is_a?(TrueClass) || @options[:readonly].is_a?(FalseClass)) ? @options[:readonly] : content?
      end

      def lang
        # Mode is there for older code, it's deprecated
        @options[:lang] || @options[:mode]
      end
    end
  end
end