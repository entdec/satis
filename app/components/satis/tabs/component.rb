# frozen_string_literal: true

module Satis
  module Tabs
    class Component < Satis::ApplicationComponent
      renders_many :tabs, Tab::Component
      attr_reader :group, :persist, :key, :custom_link

      def initialize(group: :main, persist: false, key: nil, custom_link: nil)
        super
        @group = group
        @persist = persist
        @key = key
        @scope = group
        @custom_link = custom_link
      end
    end
  end
end
