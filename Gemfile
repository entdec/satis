source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }
git_source(:entdec) { |repo_name| "git@code.entropydecelerator.com:#{repo_name}.git" }

# Specify your gem's dependencies in satis.gemspec.
gemspec

group :development do
  gem 'sqlite3'
end

group :test do
  gem 'slim'
end

# To use a debugger
# gem 'byebug', group: [:development, :test]
gem 'auxilium', '~> 3', entdec: 'components/auxilium'

gem 'pry'
gem 'sidekiq'
gem 'solargraph'
