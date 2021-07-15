require_dependency 'satis/application_controller'

module Satis
  class TablesController < ApplicationController
    def show
      @table ||= ActionTable::ActionTable.for_name(params[:id], params.reject do |p|
                                                                  %w[controller action id].include? p
                                                                end.permit!)
    end
  end
end
