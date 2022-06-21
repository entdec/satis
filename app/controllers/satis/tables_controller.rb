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

      if @filter_items && @items.is_a?(Array)
        @items = @items.select do |item|
          item.is_a?(Array) ? item[0].match?(/#{params[:term]}/i) || item[1].match?(/#{params[:term]}/i) : item.match?(/#{params[:term]}/i)
        end
      end
      @items = Kaminari.paginate_array(@items) if @items.is_a? Array
      @items = @items.page(params[:page]).per(params[:page_size]) if params[:page] && params[:page_size]

      @value_method, @text_method = value_text_methods(@items)
    end

    private

    def menu
      Satis::Menus::Builder.build(:table_menu) do |m|
        m.item :refresh, icon: 'fal fa-rotate', link: nil, link_attributes: { data: { action: 'click->satis-table#refresh' } }
        if @table.class.exportable
          m.item :export, icon: 'fal fa-file-export', link: nil, link_attributes: { data: { action: 'click->satis-table#export' } }
        end
        if params[:multi_select].present?
          m.item :multi_select, icon: 'fal fa-check-double', link: nil, type: :toggle do |m2|
            params[:multi_select].each do |item|
              m2.item item['id'], icon: item['icon'], link: item['link'],
                                  link_attributes: { data: { action: 'click->satis-table#multi_select' }, id: item['id'] }
            end
          end
        end
      end
    end

    helper_method :menu
  end
end
