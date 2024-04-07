# frozen_string_literal: true
require 'net/http'

module Satis
  module Avatar
    class Component < Satis::ApplicationComponent
      attr_reader :name, :photo, :email, :options, :color

      def initialize(name: nil, email: nil, photo: nil, **options)
        super
        @name = name
        @photo = photo
        @options = options
        @options[:class] ||= 'w-8 h-8'
        @email = email
        @background_color = "#6b7280"
        @color = options.fetch(:color, true)
      end

      def initials
        if name.present? && !name.index('@')
          name.scan(/[A-Z]/)[0..1].join
        else
          (name || email).split('@').map(&:capitalize).join('@').scan(/[A-Z]/)[0..1].join
        end
      end

      # Returns the hex-background color for the avatar based on the name or email
      def background_color
        return unless name || email || color

        @background_color = "##{Digest::MD5.hexdigest(name || email).first(6)}"
      end

      def photo_url
        return unless photo&.attached?

        Rails.application.routes.url_helpers.rails_blob_path(photo, only_path: true)
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
