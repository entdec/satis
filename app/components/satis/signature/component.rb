# frozen_string_literal: true

# Add this to your application.rb
# ActiveStorage::Engine.config.active_storage.content_types_to_serve_as_binary.delete("image/svg+xml")
module Satis
  module Signature
    class Component < ViewComponent::Base
      attr_reader :url, :form, :attribute, :options

      def initialize(form:, attribute:, **options, &block)
        @form = form
        @attribute = attribute
        @options = options
      end
    end
  end
end
