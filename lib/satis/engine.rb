require 'satis/forms/builder'

module Satis
  class Engine < ::Rails::Engine
    isolate_namespace Satis

    config.autoload_once_paths = %W[
      #{root}/app/components
    ]
  end
end
