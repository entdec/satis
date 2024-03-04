require 'tailwindcss-rails'

namespace :satis do
  namespace :tailwindcss do
    desc "Configure your Tailwind CSS"
    task :config do
      Rails::Generators.invoke("satis:tailwind_config", ["--force"])
    end
  end
end

if Rake::Task.task_defined?("tailwindcss:build")
  Rake::Task["tailwindcss:build"].enhance(["satis:tailwindcss:config"])
end