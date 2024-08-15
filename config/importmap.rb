# pin_all_from File.expand_path("../app/javascript", __dir__)

pin "satis", to: "satis/application.js", preload: false
pin "satis/utils", to: "satis/utils.js", preload: false
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true

pin_all_from Satis::Engine.root.join("app/javascript/satis/controllers"), under: "satis/controllers", to: "satis/controllers"
pin_all_from Satis::Engine.root.join("app/javascript/satis/utility_controllers"), under: "satis/utility_controllers", to: "satis/utility_controllers"

pin_all_from Satis::Engine.root.join("app/javascript/satis/elements"), under: "satis/elements", to: "satis/elements"
pin_all_from Satis::Engine.root.join("app/components/satis"), under: "satis/components", to: "satis"

pin "tippy.js", preload: false # @6.3.7
pin "@popperjs/core", to: 'popper.js.js', preload: false
pin "leaflet", to: "leaflet.js", preload: false
pin "sortablejs", to: "sortablejs.js", preload: false # @1.15.2
pin "@rails/actiontext", to: "@rails--actiontext.js" # @7.1.3
pin "trix" # @2.0.10
pin "codemirror", to: "codemirror.js", preload: false
pin "@codemirror/autocomplete", to: "@codemirror--autocomplete.js" # @6.13.0
pin "@codemirror/commands", to: "@codemirror--commands.js", preload: false # @6.3.3
pin "@codemirror/language", to: "@codemirror--language.js" # @6.10.1
pin "@codemirror/lint", to: "@codemirror--lint.js", preload: false # @6.5.0
pin "@codemirror/search", to: "@codemirror--search.js", preload: false # @6.5.6
pin "@codemirror/state", to: "@codemirror--state.js" # @6.4.1
pin "@codemirror/view", to: "@codemirror--view.js" # @6.24.1
pin "@lezer/common", to: "@lezer--common.js" # @1.2.1
pin "@lezer/highlight", to: "@lezer--highlight.js" # @1.2.0
pin "crelt", to: "crelt.js", preload: false # @1.0.6
pin "style-mod" # @4.1.2
pin "w3c-keyname" # @2.2.8
pin "@codemirror/lang-yaml", to: "@codemirror--lang-yaml.js" # @6.0.0
pin "@lezer/lr", to: "@lezer--lr.js" # @1.4.0
pin "@lezer/yaml", to: "@lezer--yaml.js" # @1.0.2
pin "@codemirror/lang-html", to: "@codemirror--lang-html.js" # @6.4.8
pin "@codemirror/lang-css", to: "@codemirror--lang-css.js" # @6.2.1
pin "@codemirror/lang-javascript", to: "@codemirror--lang-javascript.js" # @6.2.2
pin "@lezer/css", to: "@lezer--css.js" # @1.1.8
pin "@lezer/html", to: "@lezer--html.js" # @1.3.9
pin "@lezer/javascript", to: "@lezer--javascript.js" # @1.4.13
pin "@codemirror/lang-liquid", to: "@codemirror--lang-liquid.js" # @6.2.1
pin "@codemirror/lang-json", to: "@codemirror--lang-json.js" # @6.0.1
pin "@lezer/json", to: "@lezer--json.js" # @1.0.2
pin "@codemirror/lang-markdown", to: "@codemirror--lang-markdown.js" # @6.2.4
pin "@lezer/markdown", to: "@lezer--markdown.js" # @1.2.0
pin "intl-tel-input", to: "intl-tel-input.js" # @19.5.6
pin "intl-tel-input-utils", to: "intl-tel-input-utils.js" # @19.5.6
pin "pickr", to: "pickr.es5.min.js" # @0.1.4
