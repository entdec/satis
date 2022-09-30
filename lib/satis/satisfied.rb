# frozen_string_literal: true

module Satis
  module Satisfied
    extend ActiveSupport::Concern

    class_methods do
      def satisfied_options
        @_satis_satisfied_options || {}
      end
    end

    included do
      has_many :user_data, class_name: 'Satis::UserData'
    end
  end
end
