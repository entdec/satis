module Satis
  module Tabs
    class Component < Satis::ApplicationComponent
      renders_many :tabs, Tab::Component

      def intialize(group = :main)
        @group = group
      end
    end
  end
end
