require "application_system_test_case"

module Satis
  class CardsTest < ApplicationSystemTestCase
    test "card with content" do
      visit satis.documentation_cards_path

      assert_selector "#your_card div", text: "Content here"
    end

    test "card with title" do
      visit satis.documentation_cards_path

      assert_selector "#your_card_with_title .sts-card__header", text: "Your profile"
    end

    test "card with title and description" do
      visit satis.documentation_cards_path

      assert_selector "#your_card_with_title_and_description .sts-card__header", text: "Your profile"
      assert_selector "#your_card_with_title_and_description .sts-card__header", text: "Edit your profile information"
    end
  end
end
