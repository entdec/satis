module Satis
  module Page
    module Helpers
      def page(*args, &block)
        action_view.render(Satis::Page::Component.new(*args), &block)
      end
    end
  end
end
