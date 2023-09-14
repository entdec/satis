require "test_helper"

module Satis
  class UserDataTest < ActiveSupport::TestCase
    test "can create user-data" do
      user = users(:one)
      data = user.user_data.keyed(:test)
      data.data = {test: 'test'}
      data.save!
    end
  end
end
