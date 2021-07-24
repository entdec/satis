module Satis
  module Avatar
    class Component < Satis::ApplicationComponent
      attr_reader :name, :photo

      def initialize(name: nil, photo: nil)
        super
        @name = name
        @photo = photo
      end

      def initials
        name.scan(/[A-Z]/)[0..1].join
      end

      def photo_url
        helpers.main_app.url_for(photo)
      end
    end
  end
end
