module Satis
  module Info
    class Component < Satis::ApplicationComponent
      renders_many :items, InfoItem::Component
      attr_reader :group, :options

      def initialize(group: :main, **options)
        super
        @group = group
        @options = options
      end
    end
  end
end
