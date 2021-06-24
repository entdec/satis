module Satis
  module ApplicationHelper
    def form_for(name, *args, &block)
      options = args.extract_options!
      args << options.merge(builder: Satis::Forms::Builder)
      form_for(name, *args, &block)
    end

    def form_with(model: nil, scope: nil, url: nil, format: nil, **options, &block)
      options = options.reverse_merge(builder: Satis::Forms::Builder, class: '')
      form_with(model: model, scope: scope, url: url, format: format, **options, &block)
    end

    def satis
      # Shortcut
      self
    end
  end
end
