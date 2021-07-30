module Satis
  module Avatar
    class Component < Satis::ApplicationComponent
      attr_reader :name, :photo, :size_class, :email

      def initialize(name: nil, email: nil, photo: nil, size_class: 'h-8 w-8')
        super
        @name = name
        @photo = photo
        @size_class = size_class
        @email = email
      end

      def initials
        if name.present? && !name.index('@')
          name.scan(/[A-Z]/)[0..1].join
        else
          (name || email).split('@').map(&:capitalize).join('@').scan(/[A-Z]/)[0..1].join
        end
      end

      def photo_url
        return unless photo&.attached?

        helpers.main_app.url_for(photo)
      end

      def gravatar?
        return false if email.blank?

        url = "https://www.gravatar.com/avatar/#{Digest::MD5.hexdigest(email).downcase}?d=404"

        uri = URI.parse(url)
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true if uri.scheme == 'https'

        request = Net::HTTP::Get.new(uri.request_uri)
        request.add_field('User-Agent', controller.request.user_agent)
        response = http.request(request)

        response.code.to_i != 404
      end

      def gravatar_url
        "https://www.gravatar.com/avatar/#{Digest::MD5.hexdigest(email).downcase}?d=404" if gravatar?
      end
    end
  end
end
