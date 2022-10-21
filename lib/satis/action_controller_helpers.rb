# frozen_string_literal: true

module Satis
  class StsWrapper
    attr_reader :request

    def initialize(request)
      @request = request
    end

    def browser
      @browser ||= Browser.new(request.user_agent)
    end
  end

  module ActionControllerHelpers
    extend ActiveSupport::Concern

    included do
      def sts
        StsWrapper.new(request)
      end
    end

    class_methods do
      # Nothing yet
    end
  end
end
