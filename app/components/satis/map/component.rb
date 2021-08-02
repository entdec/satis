# frozen_string_literal: true

module Satis
  module Map
    class Component < Satis::ApplicationComponent
      attr_reader :latitude, :longitude, :zoom_level, :geo_json_url

      def initialize(latitude: 52.09083, longitude: 5.12222, zoom_level: 7, geo_json_url: nil)
        super
        @latitude = latitude
        @longitude = longitude
        @zoom_level = zoom_level
        @geo_json_url = geo_json_url
      end
    end
  end
end
