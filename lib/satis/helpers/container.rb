module Satis
  module Helpers
    class Container
      attr_reader :action_view

      def initialize(action_view)
        @action_view = action_view
        extend Satis::Tabs::Helpers
        extend Satis::Card::Helpers
      end

      def form_for(name, *args, &block)
        options = args.extract_options!
        args << options.merge(builder: Satis::Forms::Builder)
        action_view.form_for(name, *args, &block)
      end

      def form_with(model: nil, scope: nil, url: nil, format: nil, **options, &block)
        options = options.reverse_merge(builder: Satis::Forms::Builder, class: '')
        action_view.form_with(model: model, scope: scope, url: url, format: format, **options, &block)
      end
    end
  end
end
