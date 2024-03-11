# frozen_string_literal: true

module Satis
  class DialogsController < ::ApplicationController
    layout false
    before_action :ensure_turbo_frame_response, only: [:show]

    def show
      render params[:id]
    end

    private

    def ensure_turbo_frame_response
      return unless Rails.env.development?

      # redirect_to main_app.root_path unless turbo_frame_request?
    end
  end
end