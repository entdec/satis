module Satis
  class Documentation::FormsController < ApplicationController
    def index
      @user = User.new
    end
  end
end
