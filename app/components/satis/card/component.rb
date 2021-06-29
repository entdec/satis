module Satis
  module Card
    class Component < Satis::ApplicationComponent
      renders_many :actions

      attr_reader :title, :description

      def initialize(title: nil, description: nil, menu: nil)
        super
        @title = title
        @description = description
        @menu = menu
      end
    end
  end
end
