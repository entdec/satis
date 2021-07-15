module Satis
  module TurboTable
    module Helpers
      def turbo_table(*args, &block)
        action_view.render(Satis::TurboTable::Component.new(*args), &block)
      end
    end
  end
end
