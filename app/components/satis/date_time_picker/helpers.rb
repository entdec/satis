module Satis
  module DateTimePicker
    module Helpers
      def date_time_picker(*args, &block)
        action_view.render(Satis::DateTimePicker::Component.new(*args), &block)
      end
    end
  end
end
