namespace :satis do
  namespace :tailwindcss do
    desc "Configure your Tailwind CSS"
    task :config do
      Rails::Generators.invoke("satis:tailwind_config", ["--force"])
    end
  end
end

# tailwindcss-rails v4 picks up app/assets/tailwind/satis/engine.css itself (via tailwindcss:engines),
# so only hook in the v3 config generator when that task is absent.
if Rake::Task.task_defined?("tailwindcss:build") && !Rake::Task.task_defined?("tailwindcss:engines")
  Rake::Task["tailwindcss:build"].enhance(["satis:tailwindcss:config"])
  Rake::Task["tailwindcss:watch"].enhance(["satis:tailwindcss:config"])
end