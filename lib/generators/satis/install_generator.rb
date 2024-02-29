module Satis
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path("../templates", __FILE__)

    def create_initializer_file
      template "config/initializers/satis.rb"
    end

    def add_route
      return if Rails.application.routes.routes.detect { |route| route.app.app == Satis::Engine }
      route %(mount Satis::Engine => "/satis")
    end

    def copy_migrations
      rake "satis:install:migrations"
    end

    def add_content_to_tailwind_config
      inject_into_file "config/tailwind.config.js", before: "],\n  theme: {" do
        "  // Satis content\n" +
          %w[/app/views/**/* /app/helpers/**/* /app/controllers/**/* /app/components/**/* /app/javascript/**/*.js /app/assets/**/satis.css].map { |path| "    \"#{Satis::Engine.root}#{path}\"" }.join(",\n") +
          ",\n  "
      end
    end

    def add_content_application_tailwind_css
      inject_into_file "app/assets/stylesheets/application.tailwind.css", before: "@tailwind base;" do
        "@import '#{Satis::Engine.root}/app/assets/stylesheets/satis/satis.css';\n"
      end
    end
  end
end
