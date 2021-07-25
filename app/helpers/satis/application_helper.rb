module Satis
  module ApplicationHelper
    def sts
      @_satis_helpers_container ||= Satis::Helpers::Container.new(self)
    end

    def method_missing(method, *args, &block)
      if main_app.respond_to?(method)
        main_app.send(method, *args)
      else
        super
      end
    end
  end
end
