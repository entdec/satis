# frozen_string_literal: true

# Allows you to add dialogs to your page.
# Depends on `= turbo_frame_tag "dialog"` being present in the page, satis' page component has this by default.
#
module Satis
  module Dialog
    class Component < Satis::ApplicationComponent
      renders_many :actions

      attr_reader :title, :icon
      def initialize(title:, icon: nil)
        @title = title
        @icon = icon
      end

      def icon?
        icon.present?
      end
    end
  end
end
