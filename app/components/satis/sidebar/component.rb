# frozen_string_literal: true

module Satis
  module Sidebar
    class Component < Satis::ApplicationComponent
      renders_one :desktop_menu
      renders_one :mobile_menu

      def initialize(**options); end
    end
  end
end
