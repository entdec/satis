# pin_all_from File.expand_path("../app/javascript", __dir__)

pin "intl-tel-input", to: "./node_modules/intl-tel-input/build/js/intlTelInput.js"

pin "satis", to: "satis/application.js", preload: true
pin "utils", to: "satis/utils.js", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin '@fortawesome/fontawesome-free', to: 'https://ga.jspm.io/npm:@fortawesome/fontawesome-free@6.1.1/js/all.js'

pin_all_from Satis::Engine.root.join("app/javascript/satis/controllers"), under: "satis/controllers", to: "satis/controllers", preload: false
pin_all_from Satis::Engine.root.join("app/javascript/satis/utility_controllers"), under: "satis/utility_controllers", to: "satis/utility_controllers", preload: false

pin_all_from Satis::Engine.root.join("app/javascript/satis/elements"), under: "satis/elements", to: "satis/elements"
pin_all_from Satis::Engine.root.join("app/components/satis"), under: "satis/components", to: "satis"
pin "@rails/request.js", to: "@rails--request.js.js" # @0.0.9
pin "@popperjs/core", to: "@popperjs--core.js" # @2.11.8
pin "leaflet" # @1.9.4
pin "sortablejs" # @1.15.2
pin "tippy.js" # @6.3.7
pin "codemirror" # @6.0.1
pin "@codemirror/autocomplete", to: "@codemirror--autocomplete.js" # @6.12.0
pin "@codemirror/commands", to: "@codemirror--commands.js" # @6.3.3
pin "@codemirror/language", to: "@codemirror--language.js" # @6.10.1
pin "@codemirror/lint", to: "@codemirror--lint.js" # @6.5.0
pin "@codemirror/search", to: "@codemirror--search.js" # @6.5.6
pin "@codemirror/state", to: "@codemirror--state.js" # @6.4.1
pin "@codemirror/view", to: "@codemirror--view.js" # @6.24.1
pin "@lezer/common", to: "@lezer--common.js" # @1.2.1
pin "@lezer/highlight", to: "@lezer--highlight.js" # @1.2.0
pin "crelt" # @1.0.6
pin "style-mod" # @4.1.1
pin "w3c-keyname" # @2.2.8
