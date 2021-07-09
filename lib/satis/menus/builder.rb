# frozen_string_literal: true

module Satis
  module Menus
    class Builder
      attr_reader :options

      def self.build(*args, &block)
        Menu.new(*args, &block)
      end
    end
  end
end
