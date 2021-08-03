# frozen_string_literal: true

require 'active_support/concern'

module Satis
  module Forms
    module Concerns
      module Options
        extend ActiveSupport::Concern

        included do
          def value_text_methods(collection)
            # An array of models
            if collection.is_a?(Array) && collection.first.class < ActiveRecord::Base
              value_method ||= :id
              text_method ||= :name
            # An array of arrays, whereby the inner array is size 2: [[text,value],[text,value]]
            elsif collection.is_a?(Array) && collection.first.is_a?(Array) && collection.first.size == 2
              value_method ||= :second
              text_method ||= :first
            # An array:["textvalue","textvalue"]
            elsif collection.is_a?(Array) && !collection.first.is_a?(Array)
              value_method ||= :to_s
              text_method ||= :to_s
            # An activerecord relation
            elsif collection.class < ActiveRecord::Relation
              value_method ||= :id
              text_method ||= :name
            # An activerecord relation
            elsif collection.respond_to?(:each) && collection.first.respond_to?(:id) && collection.first.respond_to?(:name)
              value_method ||= :id
              text_method ||= :name
            # Whatever else
            else
              value_method ||= :second
              text_method ||= :first
            end
            [value_method, text_method]
          end
        end
      end
    end
  end
end
