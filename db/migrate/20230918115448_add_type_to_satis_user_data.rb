class AddTypeToSatisUserData < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!

  def change
    add_column :satis_user_data, :type, :string

    remove_index :satis_user_data, [:user_id, :key]
    add_index :satis_user_data, [:user_id, :type, :key], unique: true, algorithm: :concurrently
  end
end
