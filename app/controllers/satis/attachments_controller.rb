# frozen_string_literal: true

module Satis
  class AttachmentsController < ApplicationController
    before_action :set_objects

    def create
      @model.public_send(@attribute).attach(params[@attribute])
      @attachments = @model.public_send(@attribute).last(params[@attribute].size)

      respond_to do |format|
        format.html { redirect_to request.referer || root_path, notice: "Attachment created successfully." }
        format.turbo_stream
      end
    end

    def destroy
      @attachment = @model.public_send(@attribute).find_by(id: params[:id])
      @attachment&.purge

      respond_to do |format|
        format.html { redirect_to request.referer || root_path, notice: "Attachment deleted successfully." }
        format.turbo_stream
      end
    end

    private

    def set_objects
      @attribute = params[:attribute] || "attachments"
      @model = GlobalID::Locator.locate_signed(params[:sgid], for: "satis_attachments")
    end
  end
end
