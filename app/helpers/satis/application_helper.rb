module Satis
  module ApplicationHelper
    def satis
      @_satis_helpers_container ||= Satis::Helpers::Container.new(self)
    end
  end
end
