# frozen_string_literal: true

require 'active_support/concern'

module Satis
  module Forms
    module Concerns
      module File
        extend ActiveSupport::Concern

        included do
          def file_input(method, options = {})
            form_group(method, options) do
              safe_join [
                (custom_label(method, options[:label]) unless options[:label] == false),
                tag.div(class: 'overflow-hidden relative inline-block -mb-2') do
                  safe_join [
                    tag.button(t('.choose_file'), type: 'button',
                                                  class: 'bg-white py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'),
                    file_field(method, options.merge(class: 'w-full cursor-pointer absolute block opacity-0 inset-0'))
                  ]
                end
              ]
            end
          end
        end
      end
    end
  end
end
