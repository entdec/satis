module Satis
  module Attachments
    class Component < Satis::ApplicationComponent
      attr_reader :model, :attribute, :attachments_options

      def initialize(model, attribute, **options)
        super()
        @model = model
        @attribute = attribute
        @attachments_options = options
      end

      def attachment_style(attachment)
        if attachment.representable?
          url = attachment.representation(resize_to_limit: [200, 200]).processed.url
          "background-image: url(#{url})"
        else
          "background-color: f0f0f0"
        end
      end

      def model_sgid
        @model.to_sgid(expires_in: nil, for: "satis_attachments")
      end
    end
  end
end
