module Satis
  module Navigation
    class Component < Satis::ApplicationComponent
      attr_reader :menu, :menu_options, :commands

      renders_many :items

      def initialize(menu, **options)
        super
        @menu = menu
        @menu_options = options
        @commands = []
      end

      
    end
  end
end
