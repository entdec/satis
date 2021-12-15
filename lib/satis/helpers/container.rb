module Satis
  module Helpers
    class Container
      attr_reader :action_view

      def initialize(action_view)
        @action_view = action_view

        add_helper :appearance_switcher, Satis::AppearanceSwitcher::Component
        add_helper :avatar, Satis::Avatar::Component
        add_helper :breadcrumbs, Satis::Breadcrumbs::Component
        add_helper :card, Satis::Card::Component
        add_helper :flash_messages, Satis::FlashMessages::Component
        add_helper :info, Satis::Info::Component
        add_helper :map, Satis::Map::Component
        add_helper :menu, Satis::Menu::Component
        add_helper :page, Satis::Page::Component
        add_helper :sidebar_menu, Satis::SidebarMenu::Component
        add_helper :tabs, Satis::Tabs::Component
        add_helper :table, Satis::Table::Component
        add_helper :input, Satis::Input::Component
      end

      def copyable(name, scrub: '#')
        return if name.blank?

        action_view.content_tag('satis-copyable', name, scrub: scrub)
      end

      def form_for(name, *args, &block)
        options = args.extract_options!
        options.deep_merge!(html: { data: {} })
        options[:html][:data][:controller] ||= ''
        options[:html][:data][:controller] += ' form'
        options[:html][:data][:"form-no-submit-on-enter-value"] = !Satis.submit_on_enter?
        args << options.merge(builder: Satis::Forms::Builder)
        action_view.form_for(name, *args, &block)
      end

      def form_with(model: nil, scope: nil, url: nil, format: nil, **options, &block)
        options = options.reverse_merge(builder: Satis::Forms::Builder, class: '')
        options.deep_merge!(data: {})
        options[:data][:controller] ||= ''
        options[:data][:controller] += ' form'
        options[:data][:"form-no-submit-on-enter-value"] = !Satis.submit_on_enter?
        action_view.form_with(model: model, scope: scope, url: url, format: format, **options, &block)
      end

      def add_helper(name, component)
        self.class.define_method(name) do |*args, &block|
          original_args = args.dup
          options = args.extract_options!
          instance = if options.key? :variant
                       variant_component = component.to_s.sub(/::Component$/, "::#{options[:variant].to_s.camelize}::Component").safe_constantize
                       (variant_component || component).new(*original_args)
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
