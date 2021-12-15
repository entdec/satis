# frozen_string_literal: true

require 'test_helper'
require 'view_component/test_case'

# Mock ct helper to decouple translation in view components testing
module Satis
  class ApplicationComponent
    def ct(key = nil, **_options)
      key
    end
  end
end
