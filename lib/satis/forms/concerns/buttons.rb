# frozen_string_literal: true

require 'active_support/concern'

module Satis
  module Forms
    module Concerns
      module Buttons
        extend ActiveSupport::Concern

        included do
          alias_method :button_button, :button
          alias_method :submit_button, :submit

          # A submit button
          def submit(value = nil, options = {})
            button_button(value,
                          options.reverse_merge(name: 'commit', type: :submit, class: 'button primary',
                                                value: 'commit'))
          end

          # A regular button
          def button(value = nil, options = {}, &block)
            options = options.reverse_merge(class: 'button')
            options[:name] ||= :commit
            options[:type] ||= :submit
            button_button(value, options, &block)
          end

          # A continue button
          def continue(value = nil, options = {}, &block)
            value ||= if !@object.persisted?
                        ct('create_continue')
                      else
                        ct('update_continue')
                      end
            button_button(value, options.reverse_merge(name: 'commit', value: 'continue', class: 'button secondary'),
                          &block)
          end

          # A reset button
          def reset(value = nil, options = {}, &block)
            button_button(value, options.reverse_merge(type: :reset, class: 'button'), &block)
          end
        end
      end
    end
  end
end
