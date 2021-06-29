module Satis
  module Card
    module Helpers
      def card(*args, &block)
        action_view.render(Satis::Card::Component.new(*args), &block)
      end
    end
  end
end
