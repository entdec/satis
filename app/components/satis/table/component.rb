module Satis
  module Table
    class Component < Satis::ApplicationComponent
      attr_reader :table_name, :group, :persist, :parameters, :title

      def initialize(table_name, group: :main, persist: false, title: nil, parameters: {})
        super
        @table_name = table_name
        @group = group
        @persist = persist
        @title = title
        @parameters = parameters
      end

      def table_url
        "/action_table/#{table_name.to_s.gsub('/', '%2F')}"
      end

      def icon
      end

      def exportable
      end

      def filters
        {}
      end
    end
  end
end
