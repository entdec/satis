module Satis
  module ApplicationHelper
    def sts
      @_satis_helpers_container ||= Satis::Helpers::Container.new(self)
    end

    def method_missing(method, *args, **kwargs, &block)
      if method.to_s.ends_with?('_url') || method.to_s.ends_with?('_path')
        if main_app.respond_to?(method)
          return main_app.send(method, *args, **kwargs, &block)
        end
      end
      super
    end
  end
end
