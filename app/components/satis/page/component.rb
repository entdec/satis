module Satis
  module Page
    class Component < Satis::ApplicationComponent
      # attr_reader :url, :form, :attribute, :title, :options
      renders_one :head
      renders_one :navbar
      renders_one :sidebar
      renders_one :body

      def initialize(**options)
        @menu = options[:menu]
        @profile_menu = options[:profile_menu]
      end
    end
  end
end
