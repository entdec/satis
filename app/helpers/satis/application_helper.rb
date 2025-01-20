module Satis
  module ApplicationHelper
    def sts
      @_satis_helpers_container ||= Satis::Helpers::Container.new(self)
    end
  end
end
