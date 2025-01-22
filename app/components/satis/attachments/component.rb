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

      def model_sgid
        @model.to_sgid(expires_in: nil, for: "satis_attachments")
      end
    end
  end
end
