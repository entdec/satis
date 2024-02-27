# desc "Explaining what the task does"
# task :satis do
#   # Task goes here
# end

task :tailwind_watch do
  require 'tailwindcss-rails'
  system "#{Tailwindcss::Engine.root.join("exe/tailwindcss")} \
    -i #{Satis::Engine.root.join("app/assets/stylesheets/satis/application.tailwind.css")} \
    -o #{Satis::Engine.root.join("app/assets/builds/satis.css")} \
    -c #{Satis::Engine.root.join("config/tailwind.config.js")} \
    --postcss #{Satis::Engine.root.join("app/assets/config/postcss.config.js")} \
    --minify \
    -w"
end