require 'satis/version'
require 'satis/engine'
require 'satis/configuration'

require 'view_component'

module Satis
  class << self
    attr_reader :config

    def setup
      @config = Configuration.new
      yield config
    end

    def submit_on_enter?
      return true if config.nil?

      config.submit_on_enter
    end
  end
end
