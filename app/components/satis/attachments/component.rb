module Satis
  module Attachments
    class Component < Satis::ApplicationComponent
      attr_reader :model, :attribute, :attachments_options, :form

      def initialize(model, attribute, **options)
        super()
        @form = options[:form]
        @model = model || form.object
        @attribute = attribute
        @attachments_options = options
      end

      def model_sgid
        @model.to_sgid(expires_in: nil, for: "satis_attachments")
      end
    end
  end
end
