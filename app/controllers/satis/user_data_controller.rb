module Satis
  class UserDataController < ApplicationController
    def show
      key = request.url.split('/user_data/').last
      data = Satis.config.current_user.user_data.keyed(key)

      if data.id.present?
        render json: data.data, status: 200
      else
        render json: {}, status: 404
      end
    end

    def update
      key = request.url.split('/user_data/').last
      data = Satis.config.current_user.user_data.keyed(key)
      new_data = data.data.merge(user_data_update_params.as_json)
      data.data = new_data
      #data.data = user_data_update_params.as_json
      data.save!

      render json: data.data, status: 200
    end

    private

    def user_data_update_params
      params.require(:user_datum)
    end
  end
end
