# frozen_string_literal: true

module Satis
  class Configuration
    attr_accessor :submit_on_enter, :confirm_before_leave

    def initialize
      @submit_on_enter = true
      @confirm_before_leave = false
    end
  end
end
