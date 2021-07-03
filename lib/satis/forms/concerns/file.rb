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
                (label(method, options[:label]) unless options[:label] == false),
                custom_file_field(method, options)
              ]
            end
          end

          def custom_file_field(method, options = {})
            tag.div(class: 'input-group') do
              safe_join [
                tag.div(class: 'input-group-prepend') do
                  tag.span('Upload', class: 'input-group-text')
                end,
                tag.div(class: 'custom-file') do
                  safe_join [
                    file_field(method, options.merge(class: 'custom-file-input', data: { controller: 'file-input' })),
                    label(method, 'Choose file...', class: 'custom-file-label')
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
