module Dropdown
  class Component < ViewComponent::Base
    def initialize(url:)
      @url = url
    end
  end
end
