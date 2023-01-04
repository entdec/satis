# frozen_string_literal: true

module Satis
  module InputArray
    class Component < Satis::ApplicationComponent
      attr_reader :form, :attribute, :options

      def initialize(form:, attribute:, **options)
        super

        @form = form
        @attribute = attribute
        @options = options
        options[:input_html] ||= {}
      end
    end
  end
end
