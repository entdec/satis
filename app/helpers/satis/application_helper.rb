module Satis
  module ApplicationHelper
    def satis
      @container = Satis::Helpers::Container.new(self)
    end
  end
end
