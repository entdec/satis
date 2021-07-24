module Satis
  module SidebarMenu
    class Component < Satis::ApplicationComponent
      attr_reader :menu

      renders_many :items

      def initialize(**options)
        @menu = options[:menu]
      end
    end
  end
end
