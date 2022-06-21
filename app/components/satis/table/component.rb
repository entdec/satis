# frozen_string_literal: true

module Satis
  module Table
    class Component < Satis::ApplicationComponent
      attr_reader :table_name, :group, :persist, :parameters, :title, :multi_select

      def initialize(table_name, group: :main, persist: false, title: nil, parameters: {}, multi_select: nil)
        super
        @table_name = table_name
        @group = group
        @persist = persist
        @title = title
        @parameters = parameters
        @multi_select = multi_select
      end
    end
  end
end
