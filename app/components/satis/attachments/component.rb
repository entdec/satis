# frozen_string_literal: true

module Satis
  module Attachments
    class Component < Satis::ApplicationComponent
      attr_reader :model, :upload_url, :attachments_options

      def initialize(model, upload_url: nil, **options)
        super()
        @model = model
        @upload_url = upload_url
        @attachments_options = options
      end

      def attachment_path(attachment)
        case model
        when Template
          Papyrus.admin_template_attachment_path(model, attachment.id)
        when Product
          product_attachment_path(model, attachment.id)
        when Layout
          Nuntius.admin_layout_attachment_path(model, attachment.id)
        else
          raise "Unknown model type: #{model.class.name}"
        end
      end


      def before_render
        @upload_url ||= default_upload_url
      end

      private

      def default_upload_url
        url_for([model, :attachments])
      end
    end
  end
end
