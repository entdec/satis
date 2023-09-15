require "test_helper"

class ViewData < Satis::UserData
  json_attribute :test
end

module Satis
  class UserDataTest < ActiveSupport::TestCase
    test "can create user-data" do
      user = users(:one)
      data = user.user_data.keyed(:test)
      data.data = {test: 'test'}
      assert data.save!
    end

    test "can create user-data, using derived classes" do
      vd = ViewData.new(user: users(:one), key: 'test')
      vd.test = 'test'
      vd.save!

      assert_equal 'test', vd.test
    end
  end
end
