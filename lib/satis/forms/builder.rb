# frozen_string_literal: true

require 'satis/forms/concerns/select'
require 'satis/forms/concerns/file'

module Satis
  module Forms
    class Builder < ActionView::Helpers::FormBuilder
      delegate :t, :tag, :safe_join, :render, to: :@template

      attr_reader :template

      # Regular input
      def input(method, options = {}, &block)
        @form_options = options

        send(input_type_for(method, options), method, options, &block)
      end

      # A codemirror editor, backed by a text-area
      def editor(method, options = {}, &block)
        @form_options = options

        editor_input(method, options, &block)
      end

      # Simple-form like association
      def association(name, options, &block)
        @form_options = options

        reflection = @object.class.reflections[name.to_s]

        method = reflection.join_foreign_key

        send(input_type_for(method, options), method, options, &block)
      end

      alias button_button button
      alias submit_button submit

      # A submit button
      def submit(value = nil, options = {})
        button_button(value, options.reverse_merge(type: :submit, class: 'button primary'))
      end

      # A regular button
      def button(value = nil, options = {}, &block)
        options = options.reverse_merge(class: 'button')
        options[:type] ||= :button
        button_button(value, options, &block)
      end

      # A continue button
      def continue(value = nil, options = {}, &block)
        value ||= if !@object.persisted?
                    t('.create_continue', default: 'Create and continue editing')
                  else
                    t('.update_continue', default: 'Update and continue editing')
                  end
        button_button(value, options.reverse_merge(value: 'continue', class: 'button secondary'), &block)
      end

      # A reset button
      def reset(value = nil, options = {}, &block)
        button_button(value, options.reverse_merge(type: :reset, class: 'button'), &block)
      end

      alias rails_fields_for fields_for

      # Wrapper around fields_for, using Satis::Forms::Builder
      # Example:
      #
      #   form_for @user do |f|
      #     f.simple_fields_for :printers do |printers_form|
      #       # Here you have all satis' form methods available
      #       printers_form.input :name
      #     end
      #   end
      def fields_for(*args, &block)
        options = args.extract_options!
        name = args.first
        template_object = args.second

        reflection = @object.class.reflections[name.to_s]

        options[:html] ||= {}
        options[:builder] ||= if self.class < ActionView::Helpers::FormBuilder
                                self.class
                              else
                                Satis::Forms::Builder
                              end

        # Only do the whole nested-form thing with a collection
        if reflection.collection? && template_object
          view_options = {
            form: self,
            collection: name,
            template_object: template_object,
            options: options
          }

          tag.div(class: 'fields_for', data: { controller: 'satis-fields-for' }) do
            render 'shared/fields_for', view_options, &block
          end

          # render(Satis::FieldsFor::Component.new(
          #          form: self, name: name, template_object: template_object, **options, &block
          #        ))
        else
          rails_fields_for(*args, options, &block)
        end
      end

      def rich_text(*args)
        options = args.extract_options!
        form_group(*args, options) do
          safe_join [
            (custom_label(*args, options[:label]) unless options[:label] == false),
            rich_text_area(*args, options)
          ]
        end
      end

      # Non public

      def input_type_for(method, options)
        object_type = object_type_for_method(method)
        input_type = case object_type
                     when :date then :string
                     when :integer then :string
                     else object_type
                     end
        override_input_type = if options[:as]
                                options[:as]
                              elsif options[:collection]
                                :select
                              end

        "#{override_input_type || input_type}_input"
      end

      def form_group(method, options = {}, &block)
        tag.div class: "form-group #{method}" do
          safe_join [
            block.call,
            hint_text(options[:hint]),
            error_text(method)
          ].compact
        end
      end

      def hint_text(text)
        return if text.nil?

        tag.small text, class: 'form-text text-muted'
      end

      # FIXME: These don't work for relations or location_id, error is on location
      def error_text(method)
        return unless has_error?(method)

        tag.div(@object.errors[method].join('<br />').html_safe, class: 'invalid-feedback')
      end

      def object_type_for_method(method)
        result = if @object.respond_to?(:type_for_attribute) && @object.has_attribute?(method)
                   @object.type_for_attribute(method.to_s).try(:type)
                 elsif @object.respond_to?(:column_for_attribute) && @object.has_attribute?(method)
                   @object.column_for_attribute(method).try(:type)
                 end
        result || :string
      end

      def has_error?(method)
        return false unless @object.respond_to?(:errors)

        @object.errors.key?(method)
      end

      def custom_label(method, title, options = {})
        all_classes = "#{options[:class]} form-label".strip
        label(method, title, class: all_classes, data: options[:data])
      end

      def hidden_input(method, _options = {})
        hidden_field(method)
      end

      # Inputs and helpers
      def string_input(method, options = {})
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label]) unless options[:label] == false),
            string_field(method,
                         merge_input_options({ class: "form-control #{if has_error?(method)
                                                                        'is-invalid'
                                                                      end}" }, options[:input_html]))
          ]
        end
      end

      def text_input(method, options = {})
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label]) unless options[:label] == false),
            text_area(method,
                      merge_input_options({ class: "form-control #{if has_error?(method)
                                                                     'is-invalid'
                                                                   end}" }, options[:input_html]))
          ]
        end
      end

      def editor_input(method, options = {})
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label]) unless options[:label] == false),
            tag.div(text_area(method,
                              merge_input_options({
                                                    class: "form-control #{'is-invalid' if has_error?(method)}",
                                                    data: {
                                                      controller: 'satis-editor',
                                                      'satis-editor-target' => 'textarea',
                                                      'satis-editor-read-only-value' => options.delete(:read_only) || false,
                                                      'satis-editor-mode-value' => options.delete(:mode) || 'text/html',
                                                      'satis-editor-height-value' => options.delete(:height) || '200px',
                                                      'satis-editor-color-scheme-value' => options.delete(:color_scheme),
                                                      'satis-editor-color-scheme-dark-value' => options.delete(:color_scheme_dark)
                                                    }

                                                  }, options[:input_html])), class: 'editor'),
            hint_text(options[:hint] || '⌘-F/⌃-f: search; ⌥-g: goto line, ⌃-space: autocomplete')
          ]
        end
      end

      def boolean_input(method, options = {})
        form_group(method, options) do
          tag.div(class: 'custom-control custom-checkbox') do
            safe_join [
              check_box(method, merge_input_options({ class: 'custom-control-input' }, options[:input_html])),
              label(method, options[:label], class: 'custom-control-label')
            ]
          end
        end
      end

      # Switch
      # Pass icon: false for no icon
      def switch_input(method, options = {}, &block)
        form_group(method, options) do
          render(Satis::Switch::Component.new(form: self, attribute: method, title: options[:label], **options,
&block))
        end
      end

      include Concerns::Select
      include Concerns::File

      def collection_of(input_type, method, options = {})
        form_builder_method, custom_class, input_builder_method = case input_type
                                                                  when :radio_buttons then [:collection_radio_buttons,
                                                                                            'custom-radio', :radio_button]
                                                                  when :check_boxes then [:collection_check_boxes,
                                                                                          'custom-checkbox', :check_box]
                                                                  else raise 'Invalid input_type for collection_of, valid input_types are ":radio_buttons", ":check_boxes"'
                                                                  end
        form_group(method, options) do
          safe_join [
            label(method, options[:label]),
            tag.br,
            (send(form_builder_method, method, options[:collection], options[:value_method],
                  options[:text_method]) do |b|
               tag.div(class: "custom-control #{custom_class}") do
                 safe_join [
                   b.send(input_builder_method, class: 'custom-control-input'),
                   b.label(class: 'custom-control-label')
                 ]
               end
             end)
          ]
        end
      end

      def radio_buttons_input(method, options = {})
        collection_of(:radio_buttons, method, options)
      end

      def check_boxes_input(method, options = {})
        collection_of(:check_boxes, method, options)
      end

      def string_field(method, options = {})
        case object_type_for_method(method)
        when :date
          birthday = method.to_s =~ /birth/
          safe_join [
            date_field(method, merge_input_options(options, { data: { datepicker: true } })),
            tag.div do
              date_select(method, {
                            order: %i[month day year],
                            start_year: birthday ? 1900 : Date.today.year - 5,
                            end_year: birthday ? Date.today.year : Date.today.year + 5
                          }, { data: { date_select: true } })
            end
          ]
        when :integer then number_field(method, options)
        when :string
          case method.to_s
          when /password/ then password_field(method, options)
          # when /time_zone/ then :time_zone
          # when /country/   then :country
          when /email/ then email_field(method, options)
          when /phone/ then telephone_field(method, options)
          when /url/ then url_field(method, options)
          else
            text_field(method, options)
          end
        end
      end

      def merge_input_options(options, user_options)
        return options if user_options.nil?

        # TODO: handle class merging here
        options.merge(user_options)
      end
    end
  end
end
