# frozen_string_literal: true

require 'view_component_helper'

module Satis
  class InfoItemTest < ViewComponent::TestCase
    def test_it_shows_with_content
      doc = render_inline(Satis::InfoItem::Component.new(:test_label, content: '123456'))

      assert_match(/test_label/, doc.text)
      assert_match(/123456/, doc.text)
    end

    def test_it_hides_without_content
      doc = render_inline(Satis::InfoItem::Component.new(:test_label, content: nil))

      assert_empty doc.text
    end

    def test_it_shows_with_empty_content_and_show_always
      doc = render_inline(Satis::InfoItem::Component.new(:test_label, content: nil, show_always: true))

      assert_match(/test_label/, doc.text)
    end

    def test_it_shows_default_placeholder_when_show_always
      doc = render_inline(Satis::InfoItem::Component.new(:test_label, content: nil, show_always: true))

      assert_match(/—/, doc.text)
    end

    def test_it_shows_custom_placeholder_when_show_always
      doc = render_inline(Satis::InfoItem::Component.new(:test_label, content: nil, placeholder: 'myplaceholder',
                                                                      show_always: true))

      assert_match(/myplaceholder/, doc.text)
    end
  end
end
