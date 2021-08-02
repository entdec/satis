# frozen_string_literal: true

module Satis
  module Menu
    class Component < Satis::ApplicationComponent
      # renders_many :tabs, Tab::Component
      attr_reader :menu

      def initialize(menu)
        super
        @menu = menu
      end
    end
  end
end
