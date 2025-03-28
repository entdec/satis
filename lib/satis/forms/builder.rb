# frozen_string_literal: true

require "satis/concerns/contextual_translations"
require "satis/forms/concerns/buttons"
require "satis/forms/concerns/file"
require "satis/forms/concerns/required"
require "satis/forms/concerns/select"
require "satis/forms/concerns/options"

module Satis
  module Forms
    class Builder < ActionView::Helpers::FormBuilder
      delegate :t, :tag, :safe_join, :render, to: :@template

      attr_reader :template, :assocation

      include Concerns::Options
      include Concerns::Select
      include Concerns::File
      include Concerns::Required
      include Concerns::Buttons

      include Satis::Concerns::ContextualTranslations

      def original_view_context
        @template
      end

      # Regular input
      def input(method, options = {}, &block)
        @form_options = options

        options[:input_html] ||= {}
        options[:input_html][:disabled] = options.delete(:disabled)

        send(input_type_for(method, options), method, options, &block)
      end

      # NOTE: TDG - seems to be overwritten below
      # def input_array(method, options = {}, &block)
      #   @form_options = options
      #
      #   input_array(method, options, &block)
      # end

      # A codemirror editor, backed by a text-area
      def editor(method, options = {}, &block)
        @form_options = options

        editor_input(method, options, &block)
      end

      # Simple-form like association
      def association(name, options, &block)
        @form_options = options

        @association = name
        reflection = @object.class.reflections[name.to_s]

        method = reflection.join_foreign_key

        send(input_type_for(method, options), method, options, &block)
      end

      alias_method :rails_fields_for, :fields_for

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

        # FIXME: Yuk - is it possible to detect when this should not be allowed?
        # Like checking for whether destroy is allowed on assocations?
        allow_actions = options.key?(:allow_actions) ? options[:allow_actions] : true
        show_actions = @object.respond_to?(:"#{name}_attributes=") && @object.send(name).respond_to?(:each) && template_object && allow_actions == true

        html_options = options[:html] || {}

        html_options[:data] ||= {}
        html_options[:data] = flatten_hash(html_options[:data])
        html_options[:data][:controller] =
          ["satis-fields-for"].concat(options[:html]&.[](:data)&.[](:controller).to_s.split).join(" ")
        html_options[:class] = ["fields_for"].concat(options[:html]&.[](:class).to_s.split).join(" ")

        options[:builder] ||= if self.class < ActionView::Helpers::FormBuilder
          self.class
        else
          Satis::Forms::Builder
        end

        # Only do the whole nested-form thing with a collection
        if show_actions
          view_options = {
            form: self,
            collection: name,
            template_object: template_object,
            options: options
          }
          tag.div(**html_options) do
            render "shared/fields_for", view_options, &block
          end

          # FIXME: You would want to do this:
          # render(Satis::FieldsFor::Component.new(
          #          form: self, name: name, template_object: template_object, **options, &block
          #        ))
        else
          invalid_feedback = nil
          # if @object.errors.messages[name].present?
          #   invalid_feedback = tag.div(@object.errors.messages[name].join(", "),
          #     class: "invalid-feedback")
          # end
          safe_join [
            invalid_feedback,
            rails_fields_for(*args, options, &block)
          ].compact
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

      # A switch backed by a hidden value
      def switch(method, options = {}, &block)
        @form_options = options

        switch_input(method, options, &block)
      end

      def color(method, options = {}, &block)
        @form_options = options

        color_input(method, options, &block)
      end

      # A hidden input
      def hidden(method, options = {}, &block)
        @form_options = options

        hidden_input(method, options, &block)
      end

      def attachments(method, options = {}, &block)
        self.multipart = true
        safe_join [
          @template.render(Satis::Attachments::Component.new(object, method, form: self, **value_text_method_options(options),
            &block))
        ]
      end

      # Non public

      def input_type_for(method, options)
        object_type = object_type_for_method(method)
        input_type = case object_type
        when :date then :date_time
        when :datetime then :date_time
        when :integer then :string
        when :float then :string
        else object_type
        end
        override_input_type = if options[:as]
          options[:as]
        elsif options[:collection]
          :select
        elsif options[:url]
          :dropdown
        end

        "#{override_input_type || input_type}_input"
      end

      def form_group(method, options = {}, &block)
        tag.div(class: "form-group form-group-#{method}", data: options.delete(:data)) do
          safe_join [
            yield,
            hint_text(options[:hint]),
            error_text(method)
          ].compact
        end
      end

      def hint_text(text)
        return if text.nil?

        tag.small text, class: "form-text text-muted"
      end

      # FIXME: These don't work for relations or location_id, error is on location
      # When using the association helper, we need to set a @assocation variable
      # any other input should clear it
      def error_text(method)
        return if !has_error?(method) && !has_error?(method.to_s.gsub(/_id$/, ""))

        all_errors = @object.errors[method].dup
        all_errors += @object.errors[method.to_s.gsub(/_id$/, "")] if method.to_s.ends_with?("_id")

        tag.div(all_errors.uniq.join("<br />").html_safe,
          class: "invalid-feedback")
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
        label(method, title, class: all_classes, data: options[:data]) do |translation|
          safe_join [
            tag.span(title || translation, class: required?(method) ? "required" : ""),
            " ",
            required(method, options),
            help(method, options)
          ]
        end
      end

      def required(method, _options = {})
        return unless required?(method)

        tag.i(class: "fas fa-hexagon-exclamation")
      end

      def help(method, options = {})
        text = options[:help].presence || Satis.config.default_help_text.call(@template, @object, method,
          @options[:help_scope] || options[:help_scope])

        return if text.blank?

        tag.i(class: "fal fa-circle-info", "data-controller": "help", "data-help-content-value": text)
      end

      def hidden_input(method, options = {})
        hidden_field(method, options[:input_html] || {})
      end

      def password_input(method, options = {})
        string_input(method, options.merge(as: :password))
      end

      # Inputs and helpers
      def string_input(method, options = {})
        orig_data = options.fetch(:data, {}).merge(controller: "satis-input")
        scrollable = options.fetch(:scrollable, false)

        css_class = ["form-control"]
        css_class << "is-invalid" if has_error?(method)
        css_class << "noscroll" unless scrollable

        data = options[:input_html].fetch(:data, {})
        data = data.merge("satis-input-target" => "input")
        options[:input_html] = options[:input_html].merge(data: data)

        form_group(method, options.merge(data: orig_data)) do
          safe_join [
            (custom_label(method, options[:label], options) unless options[:label] == false),
            string_field(method, merge_input_options({as: options[:as], class: "#{css_class.join(" ")}"}, options[:input_html]))
          ]
        end
      end

      def number_input(method, options = {})
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label], options) unless options[:label] == false),
            number_field(method,
              merge_input_options({class: "form-control #{
                                     if has_error?(method)
                                       "is-invalid"
                                     end}"}, options[:input_html]))
          ]
        end
      end

      def text_input(method, options = {})
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label], options) unless options[:label] == false),
            text_area(method,
              merge_input_options({class: "form-control #{
                                  if has_error?(method)
                                    "is-invalid"
                                  end}"}, options[:input_html]))
          ]
        end
      end

      def input_array(method, options = {})
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label], options) unless options[:label] == false),
            render(Satis::InputArray::Component.new(form: self, attribute: method, **options))
          ]
        end
      end

      def editor_input(method, options = {}, &block)
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label], options) unless options[:label] == false),
            @template.render(Satis::Editor::Component.new(form: self, attribute: method, **options, &block))
          ]
        end
      end

      def signature(method, options = {}, &block)
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label], options) unless options[:label] == false),
            @template.render(Satis::Signature::Component.new(form: self, attribute: method, **options, &block))
          ]
        end
      end

      def boolean_input(method, options = {})
        form_group(method, options) do
          tag.div(class: "custom-control custom-checkbox") do
            safe_join [
              check_box(method, merge_input_options({class: "custom-control-input"}, options[:input_html])),
              label(method, options[:label], class: "custom-control-label")
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

      # Color
      def color_input(method, options = {}, &block)
        form_group(method, options) do
          render(Satis::ColorPicker::Component.new(form: self, attribute: method, **options,
            &block))
        end
      end

      # wrapper_html: { data: { 'date-time-picker-time-picker': 'true', controller: 'date-time-picker', 'date-time-picker-start-date' => (@holiday.start_at || params[:holiday]&.[](:start_at) && Time.parse(params[:holiday][:start_at]) || Time.current)&.iso8601 } }
      def date_time_input(method, options = {}, &block)
        case object_type_for_method(method)
        when :date
          options[:time_picker] = options.key?(:time_picker) ? options[:time_picker] : false
        when :datetime
          options[:time_picker] = options.key?(:time_picker) ? options[:time_picker] : true
        end
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label], options) unless options[:label] == false),
            render(Satis::DateTimePicker::Component.new(form: self, attribute: method, title: options[:label], **options,
              &block))
          ]
        end
      end

      def phone_input(method, options = {})
        # options[:input_html] = {}

        # options[:input_html] = { 'data-controller' => 'phone-number',
        #                          'data-phone-number-target': 'input',
        #                          'data-action': 'keyup->phone-number#change blur->phone-number#change' }

        tag.div("data-controller" => "phone-number") do
          safe_join [
            hidden_field(method,
              merge_input_options({class: "form-control", "data-phone-number-target": "hiddenInput"},
                options[:input_html])),
            @template.text_field_tag("dummy", @object.try(method), class: "form-control #{
                        if has_error?(method)
                          "is-invalid"
                        end}", "data-phone-number-target": "input",
              "data-action": "input->phone-number#change")
          ]
        end
      end

      def collection_of(input_type, method, options = {})
        form_builder_method, custom_class, input_builder_method = case input_type
        when :radio_buttons then [:collection_radio_buttons,
          "custom-radio", :radio_button]
        when :check_boxes then [:collection_check_boxes,
          "custom-checkbox", :check_box]
        else raise 'Invalid input_type for collection_of, valid input_types are ":radio_buttons", ":check_boxes"'
        end
        options[:value_method] ||= :last
        options[:text_method] ||= options[:label_method] || :first
        form_group(method, options) do
          safe_join [
            (custom_label(method, options[:label], options) unless options[:label] == false),
            (send(form_builder_method, method, options[:collection], options[:value_method],
              options[:text_method]) do |b|
               tag.div(class: "custom-control #{custom_class}") do
                 safe_join [
                   b.send(input_builder_method, options.fetch(:input_html, {}).merge(class: "custom-control-input")),
                   b.label(class: "custom-control-label")
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
        # if specifically set to string, no more magic.
        return text_field(method, options) if options[:as] == :string

        case options[:as] || object_type_for_method(method)
        when :date then text_field(method, options)
        when :datetime then text_field(method, options)
        when :integer then number_field(method, options)
        when :float then text_field(method, options)
        else
          case method.to_s
          when /password/ then password_field(method, options)
          # FIXME: Possibly use time_zone_select with dropdown?
          when /time_zone/ then time_zone_select(method, options.delete(:priority_zones), options,
            {class: "custom-select form-control"})
          # FIXME: Possibly use country_select with dropdown?
          when /country/ then country_select(method, options, class: "custom-select form-control")
          when /email/ then email_field(method, options)
          when /phone/ then phone_input(method, options)
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

      def flatten_hash(hash)
        hash.each_with_object({}) do |(k, v), h|
          if v.is_a? Hash
            flatten_hash(v).map do |h_k, h_v|
              h[:"#{k}_#{h_k}"] = h_v
            end
          else
            h[k] = v
          end
        end
      end
    end
  end
end
