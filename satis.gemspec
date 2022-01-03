require_relative 'lib/satis/version'

Gem::Specification.new do |spec|
  spec.name        = 'satis'
  spec.version     = Satis::VERSION
  spec.authors     = ['Tom de Grunt']
  spec.email       = ['tom@degrunt.nl']
  spec.homepage    = 'https://code.entropydecelerator.com/components/satis'
  spec.summary     = 'Its so pretty'
  spec.description = 'Pretty cool'
  spec.license     = 'MIT'

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  # spec.metadata['allowed_push_host'] = "TODO: Set to 'http://mygemserver.com'"

  # spec.metadata['homepage_uri'] = spec.homepage
  # spec.metadata['source_code_uri'] = "Put your gem's public repo URL here."
  # spec.metadata['changelog_uri'] = "Put your gem's CHANGELOG.md URL here."

  spec.files = Dir['{app,config,db,lib}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.md']

  spec.add_dependency 'diffy'
  spec.add_dependency 'rails', '>= 6.1.3.2'
  spec.add_dependency 'view_component'

  spec.add_development_dependency 'auxilium', '~> 0.2'
end
