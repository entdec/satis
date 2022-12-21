# frozen_string_literal: true

module Satis
  module Input
    class Element < ViewComponent::Base
      attr_reader :classes

      def initialize(classes: nil, colored: true)
        @classes = classes || ''
        @classes += ' colored' if colored
      end
    end

    class Component < Satis::ApplicationComponent
      attr_reader :form, :attribute, :options

      renders_one :label
      renders_one :input
      renders_one :hint
      renders_many :prefixes, Element
      renders_many :postfixes, Element

      def initialize(form: nil, attribute: nil, **options)
        @form = form
        @attribute = attribute
        @options = options
      end

      def input_class
        [@options.fetch(:input_html, {}).fetch(:class, ''), 'sts-input__input', form.has_error?(attribute) ? 'is-invalid' : ''].join(' ')
      end

      def input_container_class
        form.has_error?(attribute) && 'is-invalid'
      end
    end
  end
end
