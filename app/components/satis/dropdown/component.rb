module Satis
  module Dropdown
    class Component < ViewComponent::Base
      attr_reader :url, :form, :attribute, :options, :block

      def initialize(form:, attribute:, **options, &block)
        @form = form
        @attribute = attribute
        @options = options
        @url = options[:url]
        @block = block
        binding.pry
      end
    end
  end
end
