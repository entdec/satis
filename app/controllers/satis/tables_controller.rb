require_dependency 'satis/application_controller'

module Satis
  class TablesController < ApplicationController
    layout false

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

      @items = @filter.collection.call

      @items = Kaminari.paginate_array(@items) if @items.is_a? Array
      @items = @items.page(params[:page]).per(params[:page_size]) if params[:page] && params[:page_size]

      @value_method, @text_method = if @items.class < ActiveRecord::Relation
                                      %w[id name]
                                    elsif @items.first.size == 2
                                      %w[first last]
                                    else
                                      %w[to_s to_s]
                                    end
    end
  end
end
