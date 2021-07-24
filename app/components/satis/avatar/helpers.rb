module Satis
  module Avatar
    module Helpers
      def avatar(*args, &block)
        action_view.render(Satis::Avatar::Component.new(*args), &block)
      end
    end
  end
end
