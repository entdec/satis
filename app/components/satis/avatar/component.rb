module Satis
  module Avatar
    class Component < Satis::ApplicationComponent
      attr_reader :name, :photo, :size_class

      def initialize(name: nil, photo: nil, size_class: 'h-8 w-8')
        super
        @name = name
        @photo = photo
        @size_class = size_class
      end

      def initials
        name.scan(/[A-Z]/)[0..1].join
      end

      def photo_url
        return unless photo.attached?

        helpers.main_app.url_for(photo)
      end
    end
  end
end
