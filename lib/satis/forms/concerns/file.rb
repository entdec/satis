# frozen_string_literal: true

require 'active_support/concern'

module Satis
  module Forms
    module Concerns
      module File
        extend ActiveSupport::Concern

        included do
          def file_input(method, options = {})
            form_group(method, options.merge(data: {
                                               controller: 'satis-file'
                                             })) do
              safe_join [
                (custom_label(method, options[:label], options) unless options[:label] == false),
                tag.div(class: 'overflow-hidden relative inline-block -mb-2') do
                  safe_join [
                    tag.button((options[:multiple] ? ct('choose_files') : ct('choose_file')), type: 'button',
                                                                                            class: 'bg-white py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-200'),
                    file_field(method,
                               options.merge(class: 'w-full cursor-pointer absolute block opacity-0 inset-0',
                                             data: { 'satis-file-target': 'input' }))
                  ]
                end,
                tag.div(class: 'mt-2 text-gray-300 text-xs', data: { 'satis-file-target': 'selection' })
              ]
            end
          end
        end
      end
    end
  end
end
