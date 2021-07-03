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
            value_method = options[:value_method] || :id
            text_method = options[:text_method] || :name
            input_options = options[:input_html] || {}
            multiple = input_options[:multiple]

            collection_input(method, options) do
              collection_select(method, options[:collection], value_method, text_method, options,
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
            @template.render(Satis::Dropdown::Component.new(form: self, attribute: method, **options, &block))
          end
        end
      end
    end
  end
end
