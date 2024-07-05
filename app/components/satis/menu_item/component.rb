# frozen_string_literal: true

module Satis
  module MenuItem
    class Component < Satis::ApplicationComponent
      with_collection_parameter :item
      attr_reader :item

      # renders_many :items
      def initialize(**options)
        @item = options[:item]
      end
    end
  end
end
