# frozen_string_literal: true

module Satis
  module LinkButton
    class Component < Satis::ApplicationComponent
      attr_reader :title, :url, :icon, :type, :class_names
      # renders_many :items
      def initialize(type, title: nil, icon: nil, url: nil)
        @type = type.to_sym
        @title = title
        @icon = icon
        @url = url
        @class_names = class_names
      end
    end
  end
end
