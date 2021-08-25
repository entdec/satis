# frozen_string_literal: true

module Satis
  module SidebarMenu
    class Component < Satis::ApplicationComponent
      attr_reader :menu, :menu_options

      renders_many :items

      def initialize(menu, **options)
        super
        @menu = menu
        @menu_options = options
      end
    end
  end
end
