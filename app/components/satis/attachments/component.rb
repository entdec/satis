# frozen_string_literal: true

module Satis
  module Attachments
    class Component < Satis::ApplicationComponent
      attr_reader :model, :attachments_options, :upload_url

      def initialize(model, **options)
        super()
        @model = model
        @attachments_options = options
      end

      def before_render
        # Ensure the upload URL is properly set, using helpers.main_app if necessary
        @upload_url ||= polymorphic_path([@model, :attachments])
      end

      private

      def polymorphic_path(args)
        helpers.polymorphic_path(args)
      end

      def url_for(args)
        helpers.url_for(args)
      end
    end
  end
end
