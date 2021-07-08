module Satis
  module Tabs
    class Component < Satis::ApplicationComponent
      renders_many :tabs, Tab::Component
      attr_reader :group, :persist

      def initialize(group: :main, persist: false)
        super
        @group = group
        @persist = persist
      end
    end
  end
end
