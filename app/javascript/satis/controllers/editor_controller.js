import ApplicationController from "./application_controller"

import CodeMirror from "codemirror"

import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"
import "codemirror/addon/edit/matchtags"

import "codemirror/addon/selection/active-line"

import "codemirror/addon/mode/simple"
import "codemirror/addon/mode/multiplex"
import "codemirror/addon/dialog/dialog"
import "codemirror/addon/search/searchcursor"
import "codemirror/addon/search/search"
import "codemirror/addon/search/jump-to-line"
import "codemirror/addon/edit/matchtags"
import "codemirror/addon/hint/html-hint"
import "codemirror/addon/display/autorefresh"
import "codemirror/addon/hint/show-hint"
import "codemirror/addon/fold/foldgutter"

import "codemirror/mode/htmlmixed/htmlmixed"
import "codemirror/mode/slim/slim"
import "codemirror/mode/javascript/javascript"
import "codemirror/mode/slim/slim"
import "codemirror/mode/css/css"
import "codemirror/mode/sass/sass"
import "codemirror/mode/markdown/markdown"
import "codemirror/mode/ruby/ruby"
import "codemirror/mode/xml/xml"
import "codemirror/mode/yaml/yaml"
import "codemirror/mode/yaml-frontmatter/yaml-frontmatter"
import "codemirror/mode/sieve/sieve"

import "codemirror-liquid"

const themesContext = require.context("codemirror/theme", false, /\.css$/, "lazy")
const themes = themesContext.keys().map((fileName) => fileName.slice(2, -4))

// import "codemirror/lib/codemirror.css";
// import "codemirror/addon/dialog/dialog.css";
// import "codemirror/addon/hint/show-hint.css";
// import "codemirror/addon/fold/foldgutter.css";

// import "codemirror/theme/3024-day.css";
// import "codemirror/theme/3024-night.css";
/***
 * IDE - Editor controller
 *
 * Control codemirror
 */
export default class extends ApplicationController {
  static targets = ["textarea"]
  static values = { readOnly: Boolean, mode: String, height: String, colorScheme: String, colorSchemeDark: String }

  setTheme(theme) {
    if (themes.indexOf(theme) === -1) {
      console.error(`CodeMirror theme ${theme} is not available`)
      console.error(`Available themes ${themes.join(",")}`)
      return
    }

    themesContext(`./${theme}.css`)
    this.editor.setOption("theme", theme)
  }

  connect() {
    super.connect()

    const self = this

    let mode = { name: "liquid", base: CodeMirror.mimeModes[this.modeValue] }

    this.editor = CodeMirror.fromTextArea(this.textareaTarget, {
      lineNumbers: true,
      mode: { name: "yaml-frontmatter", base: mode },
      lineWrapping: true,
      tabSize: 2,
      autoRefresh: true,
      extraKeys: { "Ctrl-Space": "autocomplete", "Ctrl-J": "toMatchingTag" },
      foldGutter: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      matchTags: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      indentUnit: 2,
      indentWithTabs: false,
      readOnly: this.readOnlyValue,
    })

    const colorSchemeDark = this.colorSchemeDarkValue
    const colorScheme = this.colorSchemeValue

    this.editor.setSize("100%", this.heightValue)
    // Sometimes the editor does not refresh/initialize properly, this prevents that
    setTimeout(() => {
      this.editor.refresh()

      if (colorScheme || colorSchemeDark) {
        if (colorSchemeDark && (window.matchMedia("prefers-color-scheme: dark").matches || document.documentElement.classList.contains("dark"))) {
          this.setTheme(colorSchemeDark)
        } else if (colorScheme) {
          this.setTheme(colorScheme)
        }
      }
    }, 100)

    this.editor.on("change", function (editor, evt) {
      let event = new CustomEvent("editor.changed", { bubbles: true, cancelable: true, detail: { textarea: self.textareaTarget, editor: self.editor, dirty: !self.editor.getDoc().isClean() } })
      self.element.dispatchEvent(event)
    })
  }

  disconnect() {
    this.editor.toTextArea()
  }
}