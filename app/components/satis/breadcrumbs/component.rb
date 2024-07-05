# frozen_string_literal: true

module Satis
  module Breadcrumbs
    class Crumb < ViewComponent::Base
      attr_reader :path, :title, :icon

      def initialize(path: nil, title: nil, icon: nil)
        @path = path
        @title = title
        @icon = icon
      end
    end

    class Component < Satis::ApplicationComponent
      renders_many :crumbs, Crumb
      def initialize
        super
      end
    end
  end
end
