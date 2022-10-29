module Satis
  module Helpers
    class Container
      attr_reader :action_view

      delegate :add_helper, to: :class

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
        add_helper :input, Satis::Input::Component
        add_helper :spotlight, Satis::Spotlight::Component
      end

      def copyable(name, scrub: "#")
        return if name.blank?

        action_view.content_tag("satis-copyable", name, scrub: scrub)
      end

      def browser
        @browser ||= Browser.new(action_view.request.user_agent)
      end

      def form_for(name, *args, &block)
        options = args.extract_options!.deep_merge!(html: {data: {}})
        form_options_defaults!(options)
        update_form_data_options!(options[:html][:data], options)
        args << options.merge(builder: Satis::Forms::Builder)
        action_view.form_for(name, *args, &block)
      end

      def form_with(model: nil, scope: nil, url: nil, format: nil, **options, &block)
        options = options.reverse_merge(builder: Satis::Forms::Builder, class: "").deep_merge!(data: {})
        form_options_defaults!(options)
        update_form_data_options!(options[:data], options)
        action_view.form_with(model: model, scope: scope, url: url, format: format, **options, &block)
      end

      def form_options_defaults!(options)
        options[:submit_on_enter] = Satis.submit_on_enter? if options[:submit_on_enter].nil?
        options[:confirm_before_leave] = Satis.confirm_before_leave? if options[:confirm_before_leave].nil?
      end

      def update_form_data_options!(data, options)
        data[:controller] ||= ""
        data[:controller] += " form"
        data[:"form-no-submit-on-enter-value"] = !options[:submit_on_enter]
        data[:"form-confirm-before-leave-value"] = options[:confirm_before_leave]
      end

      def self.add_helper(name, component)
        if respond_to?(name)
          Satis.config.logger.warn("Helper #{name} already defined, skipping.")
          return
        end
        define_method(name) do |*args, **kwargs, &block|
          original_args = args.dup
          options = args.extract_options!
          instance = if options.key? :variant
            variant_component = component.to_s.sub(/::Component$/, "::#{options[:variant].to_s.camelize}::Component").safe_constantize
            (variant_component || component).new(*original_args, **kwargs)
          else
            component.new(*original_args, **kwargs)
          end

          instance.original_view_context = action_view
          action_view.render(instance, &block)
        end
      end
    end
  end
end
