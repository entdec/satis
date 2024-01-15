class ChangeSatisUserData < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!
  def change
    change_column :satis_user_data, :data, :jsonb, null: true, default: {}
    change_column :satis_user_data, :user_id, :uuid, null: true, foreign_key: true

    remove_index :satis_user_data, [:key]
    add_index :satis_user_data, [:user_id, :key], unique: true, algorithm: :concurrently
  end
end
