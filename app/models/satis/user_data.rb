module Satis
  class UserData < ApplicationRecord
    belongs_to :user

    validates :key, presence: true, uniqueness: true
    validates :data, presence: true

    def self.keyed(key)
      find_or_create_by(key: key)
    end
  end
end
