require_dependency 'satis/application_controller'
require 'satis/forms/concerns/options'

module Satis
  class TablesController < ApplicationController
    layout false

    include Satis::Forms::Concerns::Options

    class Filters
      include ActiveModel::Model

      def initialize(attributes = {})
        attributes.each do |attr, _value|
          # Setter
          define_singleton_method("#{attr}=") { |val| attributes[attr] = val }
          # Getter
          define_singleton_method(attr) { attributes[attr] }
        end
      end
    end

    def show
      @table ||= ActionTable::ActionTable.for_name(params[:table_name], params.permit!)

      Filters.define_method :attributes do
        @table.filters.map(&:parameter)
      end

      h = {}
      @table.filters.each do |f|
        h[f.parameter.to_sym] = params[f.parameter]
      end
      @filters = Filters.new(h)
    end

    def filter_collection
      @table ||= ActionTable::ActionTable.for_name(params[:table_name], params.permit!)
      @filter = @table.filter_by_attribute(params[:filter])

      @filter_items = true

      if @filter.collection.is_a?(Proc)
        if @filter.collection.parameters.size == 1
          @filter_items = false
          @items = @filter.collection.call(params[:term])
        else
          @items = @filter.collection.call
        end
      else
        @items = @filter.collection
      end

      @items = @items.select { |item| item.is_a?(Array) ? item[0].match?(/#{params[:term]}/i) || item[1].match?(/#{params[:term]}/i) : item.match?(/#{params[:term]}/i) } if @filter_items && @items.is_a?(Array)
      @items = Kaminari.paginate_array(@items) if @items.is_a? Array
      @items = @items.page(params[:page]).per(params[:page_size]) if params[:page] && params[:page_size]

      @value_method, @text_method = value_text_methods(@items)
    end
  end
end
