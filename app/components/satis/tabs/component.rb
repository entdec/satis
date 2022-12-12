# frozen_string_literal: true

module Satis
  module Tabs
    class Component < Satis::ApplicationComponent
      renders_many :tabs, Tab::Component
      attr_reader :group, :persist, :action_table_view, :key

      def initialize(group: :main, persist: false, action_table_view: false, key: nil)
        super
        @group = group
        @persist = persist
        @action_table_view = action_table_view
        @key = key
      end

      def view_menu(view_id)
        Satis::Menus::Builder.build(:view_menu) do |m|
          m.item :reset, icon: 'fa-solid fa-xmark', link: nil, link_attributes: {data: { reflex: 'click->ActionTable::FilterReflex#reset_filters', 'reflex-serialize-form': "true", table: params[:table], view_id: view_id} }
          m.item :save_view, icon: 'fa-regular fa-floppy-disk', link: nil, link_attributes: { data: { reflex: 'click->ActionTable::FilterReflex#save_filters', 'reflex-serialize-form': "true", table: params[:table], view_id: view_id} }
          m.item :delete_view, icon: 'fa-solid fa-trash-can', link: nil, link_attributes: { data: { reflex: 'click->ActionTable::FilterReflex#delete_view', 'reflex-serialize-form': "true", table: params[:table], view_id: view_id} }
          m.item :duplicate_view, icon: 'fa-regular fa-copy', link: nil, link_attributes: { data: { reflex: "click->ActionTable::FilterReflex#duplicate_view", 'reflex-serialize-form': "true", table: params[:table], view_id: view_id} }
        end
      end

    end
  end
end
