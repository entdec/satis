# frozen_string_literal: true

module Satis
  module FlashMessages
    class Message < Satis::ApplicationComponent
      attr_reader :message, :level, :icon

      def initialize(message:, level: :alert, icon: nil)
        super
        @message = message
        @level = level
        @icon = icon
      end

      def color_class
        case level.to_sym
        when :alert
          :'bg-red-500'
        when :notice
          :'bg-green-500'
        else
          :'bg-yellow-500'
        end
      end
    end

    class Component < Satis::ApplicationComponent
      renders_many :messages, Message
    end
  end
end
