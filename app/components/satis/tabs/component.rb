module Satis
  module Tabs
    class Component < Satis::ApplicationComponent
      renders_many :tabs, Tab::Component
      attr_reader :group

      def initialize(group: :main)
        super
        @group = group
      end
    end
  end
end
