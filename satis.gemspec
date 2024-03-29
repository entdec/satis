require_relative "lib/satis/version"

Gem::Specification.new do |spec|
  spec.name = "satis"
  spec.version = Satis::VERSION
  spec.authors = ["Tom de Grunt"]
  spec.email = ["tom@degrunt.nl"]
  spec.homepage = "https://github.com/entdec/satis"
  spec.summary = "Satis allow you to focus on features, let us do the UI/UX. It'll give you satisfaction."
  spec.description = "Pretty cool"
  spec.license = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  # spec.metadata['allowed_push_host'] = "TODO: Set to 'http://mygemserver.com'"

  # spec.metadata['homepage_uri'] = spec.homepage
  # spec.metadata['source_code_uri'] = "Put your gem's public repo URL here."
  # spec.metadata['changelog_uri'] = "Put your gem's CHANGELOG.md URL here."

  spec.files = Dir.chdir(File.expand_path("..", __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end

  spec.add_dependency "browser"
  spec.add_dependency "diffy"
  spec.add_dependency "rails", ">= 6"
  spec.add_dependency "view_component"
  spec.add_dependency "jsonb_accessor", "~> 1.4"

  spec.add_development_dependency "auxilium", "~> 3"
  spec.add_development_dependency "slim-rails", "~> 3"
  spec.add_development_dependency "faker"

  spec.add_dependency "tailwindcss-rails"
  spec.add_dependency "importmap-rails"
  spec.add_dependency "turbo-rails"
  spec.add_dependency "stimulus-rails"
end
