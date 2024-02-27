source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }
git_source(:entdec) { |repo_name| "git@github.com:entdec/#{repo_name}.git" }

# Specify your gem's dependencies in satis.gemspec.
gemspec

group :development do
  gem "pg", ">= 0.18", "< 2.0"
end

# To use a debugger
# gem 'byebug', group: [:development, :test]

gem "sidekiq"
gem "puma"
gem "sprockets-rails"
gem "pry"
gem "capybara", "~> 3.40"
gem "selenium-webdriver", "~> 4.17"
gem "slim", "~> 5.2"

group :development, :test do
  gem "standard", require: false
  gem "rubocop-rails", require: false
  gem "strong_migrations"
end
