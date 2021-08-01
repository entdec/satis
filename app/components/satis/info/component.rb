module Satis
  module Info
    class Component < Satis::ApplicationComponent
      # renders_many :items, InfoItem::Component
      renders_many :items, lambda { |*args|
                             args.last.merge!(group: group)
                             component = Satis::InfoItem::Component.new(*args)
                             component.original_view_context = original_view_context
                             component
                           }

      attr_reader :group, :options

      def initialize(group: :main, **options)
        super
        @group = group
        @options = options
      end
    end
  end
end
