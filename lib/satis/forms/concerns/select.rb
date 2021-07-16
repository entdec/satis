# frozen_string_literal: true

require 'active_support/concern'

module Satis
  module Forms
    module Concerns
      module Select
        extend ActiveSupport::Concern

        included do
          def collection_input(method, options, &block)
            form_group(method, options) do
              safe_join [
                custom_label(method, options[:label]),
                block.call
              ]
            end
          end

          def select_input(method, options = {})
            input_options = options[:input_html] || {}
            multiple = input_options[:multiple]
            options = value_text_method_options(options)

            collection_input(method, options) do
              collection_select(method, options[:collection], options[:value_method], options[:text_method], options,
                                merge_input_options({ class: "#{unless multiple
                                                                  'custom-select'
                                                                end} form-control #{if has_error?(method)
                                                                                      'is-invalid'
                                                                                    end}" }, options[:input_html]))
            end
          end

          def grouped_select_input(method, options = {})
            # We probably need to go back later and adjust this for more customization
            collection_input(method, options) do
              grouped_collection_select(method, options[:collection], :last, :first, :to_s, :to_s, options,
                                        merge_input_options({ class: "custom-select form-control #{if has_error?(method)
                                                                                                     'is-invalid'
                                                                                                   end}" }, options[:input_html]))
            end
          end

          def dropdown_input(method, options = {}, &block)
            form_group(method, options) do
              safe_join [

                custom_label(method, options[:label]),
                @template.render(Satis::Dropdown::Component.new(form: self, attribute: method, title: options[:label], **value_text_method_options(options),
  &block))
              ]
            end
          end

          def value_text_method_options(options)
            value_method = options[:value_method]
            text_method = options[:text_method]

            if options[:collection].is_a?(Array) && options[:collection].first.size == 2
              value_method ||= :last
              text_method ||= :first
            elsif options[:collection].is_a?(Array) && options[:collection].first.size == 1
              value_method ||= :to_s
              text_method ||= :to_s
            elsif options[:collection].class < ActiveRecord::Relation
              value_method ||= :id
              text_method ||= :name
            else
              value_method ||= :last
              text_method ||= :first
            end

            options.reverse_merge(value_method: value_method, text_method: text_method)
          end
        end
      end
    end
  end
end
