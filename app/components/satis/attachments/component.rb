# frozen_string_literal: true

module Satis
  module Attachments
    class Component < Satis::ApplicationComponent
      attr_reader :model, :attachments_options, :upload_url

      def initialize(model, upload_url: nil, **options)
        super()
        @model = model
        @upload_url = upload_url
        @attachments_options = options
      end

      def before_render
        @upload_url
      end

      def model_has_images
        model.respond_to?(:images)
      end

      private
      def main_app
        helpers.main_app
      end

      def url_for(args)
        helpers.url_for(args)
      end
    end
  end
end
