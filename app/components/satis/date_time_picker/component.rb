module Satis
  module DateTimePicker
    class Component < Satis::ApplicationComponent
      attr_reader :url, :form, :attribute, :inline, :options

      def initialize(form:, attribute:, **options, &block)
        super

        @form = form
        @attribute = attribute
        @options = options
        @block = block
        options[:input_html] ||= {}
        @inline = options.key?(:inline) ? options[:inline] : false
        # options[:input_html] = { data: { 'satis-switch-target' => 'hiddenInput' } }.deep_merge(options[:input_html])
      end
    end
  end
end
