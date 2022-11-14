require_relative 'satisfied'

module Satis::ActiveRecordHelpers
  extend ActiveSupport::Concern

  included do
    delegate :satisfied?, to: :class
  end

  class_methods do
    def satisfied(options = {})
      @_satis_satisfied_options = options
      include Satis::Satisfied
    end

    def satisfied?
      included_modules.include?(Satis::Satisfied)
    end
  end
end
