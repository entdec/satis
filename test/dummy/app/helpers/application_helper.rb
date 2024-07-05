module ApplicationHelper
  def sidebar_menu
    Satis::Menus::Builder.build(:sidebar) do |m|
      m.item :home, icon: "fa fa-house", link: satis.documentation_index_path

      m.item :avatars, icon: "fa fa-book", link: documentation_avatars_path
      m.item :cards, icon: "fa fa-book", link: documentation_cards_path
      m.item :forms, icon: "fa fa-book", link: documentation_forms_path
      m.item :tabs, icon: "fa fa-book", link: documentation_tabs_path
      m.item :editors, icon: "fa fa-book", link: documentation_editors_path
    end
  end
end
