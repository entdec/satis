# frozen_string_literal: true

module Satis
  module Switch
    class Component < Satis::ApplicationComponent
      attr_reader :url, :form, :attribute, :icon, :options

      def initialize(form:, attribute:, **options, &block)
        super

        @form = form
        @attribute = attribute
        @options = options
        @block = block
        @icon = true
        @icon = options[:icon] if options.key?(:icon)
        options[:input_html] ||= {}
        options[:input_html] = { data: { 'satis-switch-target' => 'hiddenInput' } }.deep_merge(options[:input_html])
      end
    end
  end
end
