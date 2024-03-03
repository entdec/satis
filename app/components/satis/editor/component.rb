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
        if @options[:lang]
          @options[:lang]
        elsif @options[:mode]
          case @options[:mode]
          when 'application/yaml'
            'yaml'
          when 'application/json'
            'json'
          when 'text/x-ruby'
            ''

          end
        end
      end

      def value
        if content?
          html_escape_once(content)
        elsif options[:input_html]&.[](:value)
          options[:input_html][:value]
        elsif form
          form.object.send(attribute)
        end
      end
    end
  end
end