# frozen_string_literal: true

module Satis
  class AttachmentsController < ApplicationController
    before_action :set_objects

    def create
      @attachments = params[:attachments].map do |file|
        @model.public_send(@attachment_type).attach(file)
      end
      respond_to do |format|
        format.html { redirect_to request.referer || root_path, notice: "Attachment created successfully." }
        format.turbo_stream
      end
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
