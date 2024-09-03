# frozen_string_literal: true

module Satis
  class AttachmentsController < ApplicationController
    before_action :set_objects

    def index; end

    def create
      params[:attachments].each do |file|
        @model.images.attach(file)
      end
    end

    def destroy
      attachment = @model.images.find( params[:id])
      attachment&.purge

      render :create
    end

    def show
      attachment = @model.images.find(params[:id])
      send_file attachment.blob.service.path_for(attachment.key), type: attachment.content_type, disposition: 'attachment'
    end

    private


    def set_objects
      if params[:sgid]
        @model = GlobalID::Locator.locate_signed(params[:sgid], for: 'satis_attachments')
        raise ActiveRecord::RecordNotFound, 'Model not found' unless @model
      else
        model_class = [Template, Product, Layout].detect { |klass| params["#{klass.name.underscore}_id"].present? }
        raise ActiveRecord::RecordNotFound, 'Model not found' unless model_class

        @model = policy_scope(model_class).find(params["#{model_class.name.underscore}_id"])
      end
    end
  end
end
