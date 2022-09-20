module Satis
  class UserDataTabsController < ApplicationController
    # skip_before_action :verify_authenticity_token
    protect_from_forgery unless: -> { request.format.json? }

    def show
      current_user = Satis.config.current_user

      tokens = current_user.user_data['tokens'] || []

      t = tokens.find { |t| t['key'] == params[:id] }

      if t.nil?
        render json: {}, status: 404
      else
        render json: t, status: 200
      end
    end

    def update
      current_user = Satis.config.current_user

      tokens = current_user.user_data['tokens'] || []

      t = tokens.find { |t| t['key'] == user_data_update_params[:data_key] }

      if t.nil?
        t = { key: user_data_update_params[:data_key], index: user_data_update_params[:tab_index] }
        tokens << t
      else
        t['index'] = user_data_update_params[:tab_index]
      end

      current_user.user_data['tokens'] = tokens
      current_user.save!

      render json: {}, status: 200
    end

    private

    def user_data_update_params
      params.require(:user_data_tab).permit(:tab_index, :data_key)
    end
  end
end
