module Satis
  module Map
    module Helpers
      def map(*args, &block)
        action_view.render(Satis::Map::Component.new(*args), &block)
      end
    end
  end
end
