# frozen_string_literal: true

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
                    { "weekday": 'long', "month": 'short', "year": 'numeric', "day": 'numeric',
                      "hour": 'numeric', "minute": 'numeric', "hour12": false }
                  end

        options[:input_html].merge!('data-satis-date-time-picker-target' => 'hiddenInput')

        # FIXME: deal with ranges and multiples
        hidden_value = options[:input_html][:value]
        hidden_value ||= @form.object.send(attribute)
        hidden_value = hidden_value&.iso8601

        options[:input_html][:value] = hidden_value
      end

      def week_start
        Date::DAYS_INTO_WEEK[Date.beginning_of_week] || 1
      end
    end
  end
end
