# frozen_string_literal: true

module Satis
  module Signature
    class Component < ViewComponent::Base
      attr_reader :url, :form, :attribute, :title, :options

      def initialize(form:, attribute:, **options, &block)
        @form = form
        @attribute = attribute
      end
    end
  end
end
