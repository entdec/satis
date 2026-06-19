# frozen_string_literal: true

require 'test_helper'
require 'satis/concerns/contextual_translations'

module Satis
  module Concerns
    class ContextualTranslationsTest < ActiveSupport::TestCase
      class FakeController
        attr_reader :last_key, :last_options

        def t(key = nil, **options)
          @last_key = key
          @last_options = options
          key
        end
      end

      class FakeViewContext
        attr_reader :controller, :controller_path, :action_name
        attr_accessor :virtual_path

        def initialize(virtual_path: nil)
          @controller = FakeController.new
          @controller_path = 'admin/spaces'
          @action_name = 'update'
          @virtual_path = virtual_path
        end
      end

      class Translator
        include Satis::Concerns::ContextualTranslations

        attr_reader :original_view_context

        def initialize(original_view_context)
          @original_view_context = original_view_context
        end

        def i18n_scope; end
      end

      test 'relative translations are scoped to the captured original template virtual path' do
        context = FakeViewContext.new(virtual_path: 'satis/card/component')
        translator = Translator.new(context)
        translator.original_virtual_path = 'admin/spaces/edit'

        assert_equal 'admin.spaces.edit.tabs.main', translator.ct('.main', scope: :tabs)
        assert_equal 'admin.spaces.edit.tabs.main', context.controller.last_key
        assert_equal({}, context.controller.last_options)
      end

      test 'partial virtual paths are normalized like Rails translation helper scopes' do
        context = FakeViewContext.new(virtual_path: 'admin/spaces/_form')
        translator = Translator.new(context)

        assert_equal 'admin.spaces.form.title', translator.ct('.title')
      end

      test 'uses the render stack path for nested components' do
        context = FakeViewContext.new(virtual_path: 'satis/tabs/component')
        translator = Translator.new(context)

        Satis.with_original_virtual_path('admin/spaces/edit') do
          translator.original_virtual_path = Satis.current_original_virtual_path
        end

        assert_equal 'admin.spaces.edit.tab.info', translator.ct('.info', scope: :tab)
      end

      test 'falls back to controller action scope when virtual path is unavailable' do
        context = FakeViewContext.new
        translator = Translator.new(context)

        assert_equal 'admin.spaces.update.title', translator.ct('.title')
      end

      test 'does not use satis component template paths as translation scope' do
        context = FakeViewContext.new(virtual_path: 'satis/tabs/component')
        translator = Translator.new(context)

        assert_equal 'admin.spaces.update.tab.info', translator.ct('.info', scope: :tab)
      end
    end
  end
end
