# frozen_string_literal: true

module Satis
  class Configuration
    attr_accessor :submit_on_enter

    def initialize
      @submit_on_enter = true
    end
  end
end
