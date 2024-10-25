# frozen_string_literal: true

module Satis
  module CallToAction
    class Component < Satis::ApplicationComponent
      renders_many :actions, LinkButton::Component

      attr_reader :identifier, :title, :description, :style

      def initialize(identifier = nil,
        icon: nil,
        title: nil,
        description: nil,
        style: :regular)
        super

        @identifier = identifier
        @title = title
        @description = description
        @style = style
      end
    end
  end
end
