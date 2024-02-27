require 'tailwindcss-rails'
task :tailwind_watch do
  system "#{Tailwindcss::Engine.root.join("exe/tailwindcss")} \
    -i #{Satis::Engine.root.join("app/assets/stylesheets/satis/application.tailwind.css")} \
    -o #{Satis::Engine.root.join("app/assets/builds/satis.css")} \
    -c #{Satis::Engine.root.join("config/tailwind.config.js")} \
    --postcss #{Satis::Engine.root.join("app/assets/config/postcss.config.js")} \
    --minify \
    -w"
end

# require "tailwindcss-rails"
#
# SATIS_TAILWIND_COMPILE_COMMAND = "#{Tailwindcss::Engine.root.join("exe/tailwindcss")} \
#   -i #{Satis::Engine.root.join("app/assets/stylesheets/satis/application.tailwind.css")} \
#   -o #{Satis::Engine.root.join("app/assets/builds", "satis/tailwind.css")} \
#   -c #{Satis::Engine.root.join("config/tailwind.config.js")} \
#   --postcss #{Satis::Engine.root.join("app/assets/config/postcss.config.js")} \
#   --minify"
#
# # namespace :satis do
#   namespace :tailwindcss do
#     desc "Build your Tailwind CSS"
#     task :build do
#       Rails::Generators.invoke("satis:tailwind_config", ["--force"])
#       system SATIS_TAILWIND_COMPILE_COMMAND
#     end
#
#     desc "Watch and build your Tailwind CSS"
#     task :watch do
#       Rails::Generators.invoke("satis:tailwind_config", ["--force"])
#       system "#{SATIS_TAILWIND_COMPILE_COMMAND} -w"
#     end
#   end
# # end
#
# if Rake::Task.task_defined?("assets:precompile")
#   Rake::Task["assets:precompile"].enhance(["satis:tailwindcss:build"])
# end