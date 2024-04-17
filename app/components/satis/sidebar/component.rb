# app/components/satis/sidebar/component.rb
module Satis
  module Sidebar
    class Component < Satis::ApplicationComponent
      attr_reader :menu, :menu_options

      renders_many :items

      def initialize(menu)
        super
        @menu = menu
      end
    end
  end
end
