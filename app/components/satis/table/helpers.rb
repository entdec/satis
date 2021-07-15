module Satis
  module Table
    module Helpers
      def table(*args, &block)
        action_view.render(Satis::Table::Component.new(*args), &block)
      end
    end
  end
end
