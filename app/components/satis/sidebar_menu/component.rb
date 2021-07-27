module Satis
  module SidebarMenu
    class Component < Satis::ApplicationComponent
      attr_reader :menu

      renders_many :items

      def initialize(menu, **_options)
        super
        @menu = menu
      end
    end
  end
end
