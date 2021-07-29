module Satis
  module Helpers
    class Container
      attr_reader :action_view

      def initialize(action_view)
        @action_view = action_view

        extend Satis::Avatar::Helpers
        extend Satis::Card::Helpers
        extend Satis::DateTimePicker::Helpers
        extend Satis::Info::Helpers
        extend Satis::Map::Helpers
        extend Satis::Menu::Helpers
        extend Satis::Page::Helpers
        extend Satis::SidebarMenu::Helpers
        extend Satis::Tabs::Helpers
        extend Satis::Table::Helpers
      end

      def copyable(name, scrub: '#')
        return if name.blank?

        "<satis-copyable scrub=\"#{scrub}\">#{name}</satis-copyable>"
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
