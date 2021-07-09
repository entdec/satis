module Satis
  module Menu
    module Helpers
      def menu(*args, &block)
        action_view.render(Satis::Menu::Component.new(*args), &block)
      end
    end
  end
end
