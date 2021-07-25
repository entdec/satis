module Satis
  module DateTimePicker
    class Component < Satis::ApplicationComponent
      attr_reader :form, :attribute, :inline, :options, :clearable, :format, :time_picker, :multiple, :range

      def initialize(form:, attribute:, **options, &block)
        super

        @form = form
        @attribute = attribute
        @options = options
        @block = block
        options[:input_html] ||= {}
        @time_picker = options.key?(:time_picker) ? options[:time_picker] : true
        @inline = options.key?(:inline) ? options[:inline] : false
        @clearable = options.key?(:clearable) ? options[:clearable] : true
        @multiple = options.key?(:multiple) ? options[:multiple] : false
        @range = options.key?(:range) ? options[:range] : false

        @format = if options.key?(:format)
                    options[:format]
                  else
                    { "weekday": 'long', "month": 'short', "day": 'numeric',
                      "hour": 'numeric', "minute": 'numeric', "hour12": false }
                  end

        options[:input_html].merge!('data-satis-date-time-picker-target' => 'hiddenInput',
                                    value: form.object.send(attribute))
      end
    end
  end
end
