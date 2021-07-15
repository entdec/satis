module Satis
  module UiTable
    module Helpers
      def ui_table(*args, &block)
        action_view.render(Satis::Table::Component.new(*args), &block)
      end
    end
  end
end
