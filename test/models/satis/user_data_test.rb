require "test_helper"

class ViewData < Satis::UserData
  json_attribute :test
end

module Satis
  class UserDataTest < ActiveSupport::TestCase
    test "can create user-data" do
      user = users(:one)
      data = user.user_data.keyed(:test)
      data.data = { test: "test" }
      assert data.save!
    end

    test "can create user-data, using derived classes" do
      vd = ViewData.new(user: users(:one), key: "test")
      vd.test = "test"
      vd.save!

      assert_equal "test", vd.test
      assert_equal "ViewData", vd.type
    end

    test "can find user-data using derived classes" do
      vd = ViewData.new(user: users(:one), key: "test")
      vd.test = "view_data"
      vd.save!

      vd = UserData.new(user: users(:one), key: "test")
      vd.data = { test: "test" }
      vd.save!

      vd = ViewData.keyed('test')

      assert_equal "view_data", vd.test
      assert_equal "ViewData", vd.type
    end
  end
end
