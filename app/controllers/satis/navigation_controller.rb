module Satis
  class NavigationController < ApplicationController
    def search
      term = params[:query]
      component = Satis::Navigation::Component.new
      results = component.search(term)

      render json: results.map { |result| { name: result.name } }
    end
  end
end
