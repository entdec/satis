module Satis
  module Helpers
    class Container
      attr_reader :action_view

      def initialize(action_view)
        @action_view = action_view

        add_helper :avatar, Satis::Avatar::Component
        add_helper :card, Satis::Card::Component
        add_helper :info, Satis::Info::Component
        add_helper :map, Satis::Map::Component
        add_helper :menu, Satis::Menu::Component
        add_helper :page, Satis::Page::Component
        add_helper :sidebar_menu, Satis::SidebarMenu::Component
        add_helper :tabs, Satis::Tabs::Component
        add_helper :table, Satis::Table::Component
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

      def add_helper(name, component)
        self.class.define_method(name) do |*args, &block|
          original_args = args.dup
          options = args.extract_options!
          instance = if options.key? :variant
                       component.new(*original_args).with_variant(options[:variant])
                     else
                       component.new(*original_args)
                     end

          instance.original_view_context = action_view
          action_view.render(instance, &block)
        end
      end
    end
  end
end
