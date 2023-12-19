# frozen_string_literal: true

module Satis
  module Tabs
    class Component < Satis::ApplicationComponent
      renders_many :tabs, Tab::Component
      attr_reader :group, :persist, :key

      def initialize(group: :main, persist: false, key: nil)
        super
        @group = group
        @persist = persist
        @key = key
        @scope = group
      end
    end
  end
end
