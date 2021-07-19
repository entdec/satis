module Satis
  module Info
    module Helpers
      def info(*args, &block)
        action_view.render(Satis::Info::Component.new(*args), &block)
      end
    end
  end
end
