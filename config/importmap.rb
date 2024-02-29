# pin_all_from File.expand_path("../app/javascript", __dir__)

pin "intl-tel-input", to: "./node_modules/intl-tel-input/build/js/intlTelInput.js"

pin "satis", to: "satis/application.js", preload: false
pin "utils", to: "satis/utils.js", preload: false
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin '@fortawesome/fontawesome-free', to: 'https://ga.jspm.io/npm:@fortawesome/fontawesome-free@6.1.1/js/all.js', preload: false

pin_all_from Satis::Engine.root.join("app/javascript/satis/controllers"), under: "satis/controllers", to: "satis/controllers", preload: false
pin_all_from Satis::Engine.root.join("app/javascript/satis/utility_controllers"), under: "satis/utility_controllers", to: "satis/utility_controllers", preload: false

pin_all_from Satis::Engine.root.join("app/javascript/satis/elements"), under: "satis/elements", to: "satis/elements", preload: false
pin_all_from Satis::Engine.root.join("app/components/satis"), under: "satis/components", to: "satis", preload: false

pin "@rails/request.js", preload: false # @0.0.9
pin "tippy.js", preload: false # @6.3.7
pin "@popperjs/core", to: 'popper.js/popper.js', preload: false
pin "leaflet", to: "leaflet", preload: false
pin "sortablejs", to: "sortablejs.js", preload: false # @1.15.2
pin "codemirror", to: "codemirror.js", preload: false
pin "@codemirror/autocomplete", to: "@codemirror--autocomplete.js", preload: false # @6.12.0
pin "@codemirror/commands", to: "@codemirror--commands.js", preload: false # @6.3.3
pin "@codemirror/language", to: "@codemirror--language.js", preload: false # @6.10.1
pin "@codemirror/lint", to: "@codemirror--lint.js", preload: false # @6.5.0
pin "@codemirror/search", to: "@codemirror--search.js", preload: false # @6.5.6
pin "@codemirror/state", to: "@codemirror--state.js", preload: false # @6.4.1
pin "@codemirror/view", to: '@codemirror--view.js', preload: false # @6.24.1
pin "@lezer/common", to: "@lezer--common.js", preload: false # @1.2.1
pin "@lezer/highlight", to: "@lezer--highlight.js", preload: false # @1.2.0
pin "crelt", to: "crelt.js", preload: false # @1.0.6
pin "style-mod", to: "style-mod.js", preload: false # @4.1.1
pin "w3c-keyname", to: "w3c-keyname.js", preload: false # @2.2.8
