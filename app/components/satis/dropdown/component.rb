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

        options[:input_html] ||= {}

        actions = [options[:input_html]['data-action'], 'change->satis-dropdown#display',
                   'focus->satis-dropdown#focus'].join(' ')

        options[:input_html].merge!('data-satis-dropdown-target' => 'hiddenInput',
                                    'data-action' => actions)

        @block = block
      end

      # Deal with context
      def hidden_value
        value = form.object&.send(attribute)
        value = value.id if value.respond_to? :id
        value
      end

      def placeholder
        title || attribute.to_s.humanize
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
    end
  end
end
