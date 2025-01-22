# frozen_string_literal: true

module Satis
  class AttachmentsController < ApplicationController
    before_action :set_objects

    def index
      @attachments = @model.public_send(@attachment_type)
      render json: @attachments
    end

    def create
      params[:attachments].each do |file|
        @model.public_send(@attachment_type).attach(file)
      end
      redirect_to request.referer || root_path, notice: "Attachment created successfully."
    end

    def destroy
      @attachment = @model.public_send(@attachment_type).find_by(id: params[:id])
      @attachment&.purge

      respond_to do |format|
        format.html { redirect_to request.referer || root_path, notice: "Attachment deleted successfully." }
        format.turbo_stream
      end
    end

    private

    def set_objects
      @attachment_type = params[:attribute] || "attachments"
      @model = GlobalID::Locator.locate_signed(params[:sgid], for: "satis_attachments")
    end
  end
end
