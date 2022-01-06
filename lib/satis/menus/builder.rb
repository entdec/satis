# frozen_string_literal: true

module Satis
  module Menus
    class Builder
      attr_reader :options

      def self.build(*args, **kwargs, &block)
        Menu.new(*args, **kwargs, &block)
      end
    end
  end
end
