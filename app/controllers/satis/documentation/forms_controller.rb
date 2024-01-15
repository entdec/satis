module Satis
  class Documentation::FormsController < ApplicationController
    def index
      @user = User.new
    end

    def select
      @users = (1..1000).map do |i|
        [Faker::Name.first_name, Faker::Name.first_name].join(" ")
      end
      render layout: false
    end
  end
end
