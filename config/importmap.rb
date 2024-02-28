# pin_all_from File.expand_path("../app/javascript", __dir__)

pin "intl-tel-input", to: "./node_modules/intl-tel-input/build/js/intlTelInput.js"

pin "satis", to: "satis/application.js", preload: true
pin "utils", to: "satis/utils.js", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin '@fortawesome/fontawesome-free', to: 'https://ga.jspm.io/npm:@fortawesome/fontawesome-free@6.1.1/js/all.js'
pin_all_from Satis::Engine.root.join("app/javascript/satis/controllers"), under: "satis/controllers", to: "satis/controllers"
pin_all_from Satis::Engine.root.join("app/javascript/satis/utility_controllers"), under: "satis/utility_controllers", to: "satis/utility_controllers"
pin_all_from Satis::Engine.root.join("app/components/satis"), under: "satis/components", to: "satis"
pin "@rails/request.js", to: "@rails--request.js.js" # @0.0.9
pin "@popperjs/core", to: "https://ga.jspm.io/npm:@popperjs/core@2.11.0/lib/index.js"
pin "leaflet" # @1.9.4
pin "sortablejs" # @1.15.2
