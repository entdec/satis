class CreateSatisUserData < ActiveRecord::Migration[6.1]
  def change
    create_table :satis_user_data, id: :uuid do |t|
      t.string :key, null: false
      t.jsonb :data, null: false, default: {}
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
    add_index :satis_user_data, :key, unique: true
    add_index :satis_user_data, :data, using: :gin
  end
end
