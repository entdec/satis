# frozen_string_literal: true

# FIXME:
# translation scope seems wrong:
#   old/okay) title="translation missing: en.users.edit.card.profile.tab.about"
# new/broken) title="translation missing: en.users.edit.tabs.main.tab.about"

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
