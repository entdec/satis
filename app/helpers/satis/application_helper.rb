module Satis
  module ApplicationHelper
    def sts
      @_satis_helpers_container ||= Satis::Helpers::Container.new(self)
    end

    def method_missing(method, *args, **kwargs, &block)
      if method.to_s.ends_with?('_url') || method.to_s.ends_with?('_path') && main_app.respond_to?(method)
        main_app.send(method, *args, **kwargs, &block)
      else
        super
      end
    end
  end
end
