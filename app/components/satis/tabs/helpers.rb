module Satis
  module Tabs
    module Helpers
      def tabs(*args, &block)
        action_view.render(Satis::Tabs::Component.new(*args), &block)
      end
    end
  end
end
