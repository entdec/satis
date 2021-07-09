require 'test_helper'

module Menus
  class BuilderTest < ActiveSupport::TestCase
    test 'it builds menus' do
      menu = Satis::Menus::Builder.build do |m|
        m.item :home, icon: 'house', link: 'http://127.0.0.1'
      end

      assert_equal 1, menu.items.size
      item = menu.items.first
      assert_equal 'house', item.icon
    end

    test 'it builds sub-menus' do
      menu = Satis::Menus::Builder.build do |m|
        m.item :customer, icon: 'address-book', link: 'http://127.0.0.1/customers' do |cm|
          cm.item :create, icon: 'plus', link: 'http://127.0.0.1/customers/new'
        end
      end

      assert_equal 1, menu.items.size
      item = menu.items.first
      assert_equal 'address-book', item.icon

      assert item.menu

      assert_equal 1, item.menu.items.size
      item = item.menu.items.first
      assert_equal 'plus', item.icon
    end
  end
end
