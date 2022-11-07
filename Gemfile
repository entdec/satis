source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }
git_source(:entdec) { |repo_name| "git@github.com:entdec/#{repo_name}.git" }

# Specify your gem's dependencies in satis.gemspec.
gemspec

group :development do
  gem "sqlite3"
end

group :test do
  gem "slim"
end

# To use a debugger
# gem 'byebug', group: [:development, :test]

gem "pry"

gem "sidekiq"

group :development, :test do
  gem "solargraph", require: false
  gem "ruby-lsp", require: false
  gem "standard", require: false
  gem "rubocop-rails", require: false
end
