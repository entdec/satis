# frozen_string_literal: true

module Satis
  module ColorPicker
    class Component < ApplicationComponent
      attr_reader :form, :attribute, :css_variable, :css_scope

      def initialize(attribute:, form: nil, css_variable: nil, css_scope: ":root") # rubocop:disable Lint/MissingSuper
        @form = form
        @attribute = attribute
        @css_variable = css_variable
        @css_scope = css_scope
      end
    end
  end
end
