module Satis
  module SidebarMenu
    module Helpers
      def sidebar_menu(*args, &block)
        @options = args.extract_options!
        component = if @options.key? :variant
                      Satis::SidebarMenu::Component.new(*args).with_variant(@options[:variant])
                    else
                      Satis::SidebarMenu::Component.new(*args)
                    end

        action_view.render(component, &block)
      end
    end
  end
end
