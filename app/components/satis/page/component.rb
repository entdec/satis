# frozen_string_literal: true

module Satis
  module Page
    class Component < Satis::ApplicationComponent
      renders_one :head
      renders_one :navbar
      renders_one :sidebar, Sidebar::Component
      renders_one :body

      def initialize(**options); end
    end
  end
end
