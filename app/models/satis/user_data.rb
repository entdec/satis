module Satis
  class UserData < ApplicationRecord
    belongs_to :user, optional: true

    validates :key, presence: true, uniqueness: { scope: :user_id, allow_nil: true }

    def self.keyed(key)
      find_or_create_by(key: key)
    end
  end
end