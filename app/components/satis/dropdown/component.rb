# frozen_string_literal: true

module Satis
  module Dropdown
    class Component < ViewComponent::Base
      attr_reader :url, :form, :attribute, :title, :options

      def initialize(form:, attribute:, **options, &block)
        super

        @form = form
        @attribute = attribute
        @title = title
        @options = options
        @url = options[:url]
        @chain_to = options[:chain_to]
        @free_text = options[:free_text]
        @needs_exact_match = options[:needs_exact_match]
        @reset_button = options[:reset_button] || options[:include_blank]
        @toggle_button = options[:toggle_button] != false

        options[:input_html] ||= {}

        options[:input_html][:value] = hidden_value

        options[:input_html][:autofocus] ||= false
        if options[:input_html][:autofocus]
          options[:autofocus] = "autofocus"
          options[:input_html].delete(:autofocus)
        end

        unless options[:input_html]["data-reflex"]
          actions = [options[:input_html]["data-action"], "change->satis-dropdown#display",
            "focus->satis-dropdown#focus"].join(" ")
        end

        options[:input_html].merge!("data-satis-dropdown-target" => "hiddenSelect",
          "data-action" => actions)

        @block = block
        @page_size = options[:page_size] || 25
      end

      # Deal with context
      def hidden_value
        value = @options[:selected]
        value ||= @options.dig(:input_html, :value)
        value ||= form.object&.send(attribute)

        value = value.id if value.respond_to?(:id)

        value = value.second if value.is_a?(Array) && value.size == 2 && value.first.casecmp?(value.second)
        value
      end

      def options_array(obj)
        return [[]] unless obj

        if obj.is_a?(Array)
          obj.filter_map { |item| option_value(item) }
        else
          [option_value(obj)]
        end
      end

      def option_value(item)
        text = value = ""

        if item.respond_to?(:id)
          value = item.send(:id)
          text = if item.respond_to?(:name)
            item.send(:name)
          else
            ""
          end
        elsif item.is_a?(Array)
          value = item.first
          text = item.second
        elsif item.is_a?(String)
          text = value = item
        end

        return nil if value.blank?
        [text, item, {selected: true}]
      end

      def placeholder
        return title if title.present?

        if form.object.class.respond_to?(:human_attribute_name)
          form.object.class.human_attribute_name(attribute)
        else
          attribute.to_s.humanize
        end
      end

      def value_method
        options[:value_method] || :id
      end

      def text_method
        options[:text_method] || :name
      end

      def custom_item_html?
        !!@block
      end

      def item_html(item)
        form.template.capture { @block.call(item) }
      end

      def input_class
        [@options.fetch(:input_html, {}).fetch(:class, ""), form.has_error?(attribute) ? "is-invalid" : ""].join(" ")
      end
    end
  end
end
