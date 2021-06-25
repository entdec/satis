module Satis
  module Tabs
    module Helpers
      def tabs(&block)
        action_view.render(Satis::Tabs::Component.new, &block)
      end
    end
  end
end
