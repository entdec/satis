import ApplicationController from 'satis/controllers/application_controller'

import { basicSetup, EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'

/***
 * IDE - Editor controller
 *
 * Control codemirror
 */
export default class EditorController extends ApplicationController {
  static targets = ['textarea']
  static values = { readOnly: Boolean, mode: String, height: String, colorScheme: String, colorSchemeDark: String }

  setTheme (theme) {
    // if (themes.indexOf(theme) === -1) {
    //   console.error(`CodeMirror theme ${theme} is not available`)
    //   console.error(`Available themes ${themes.join(',')}`)
    //   return
    // }
    //
    // themesContext(`./${theme}.css`)
    // this.editor.setOption('theme', theme)
  }

  connect () {
    super.connect()
    console.log('hi')
    const self = this

    const fixedHeightEditor = EditorView.theme({
      '&': { height: '8rem', maxHeight: '8rem' },
      '.cm-gutter,.cm-content': { minHeight: '8rem' },
      '.cm-scroller': { overflow: 'auto' },
      '&.cm-focused': {
        outline: 'none',
      },
    })

    this.editor = new EditorView({
      doc: this.textareaTarget.value,
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        fixedHeightEditor,
        EditorState.readOnly.of(this.readOnlyValue),
        EditorView.updateListener.of((view) => {
          if (view.docChanged) { this.sync() }
        })
      ],
      parent: this.element,
      // // mode: { name: "yaml-frontmatter", base: mode },
      // tabSize: 2,
      // autoRefresh: true,
      // extraKeys: { "Ctrl-Space": "autocomplete", "Ctrl-J": "toMatchingTag" },
      // foldGutter: true,
      // autoCloseBrackets: true,
      // autoCloseTags: true,
      // matchTags: true,
      // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      // indentUnit: 2,
      // indentWithTabs: false,
      // readOnly: this.readOnlyValue,
    })

    const colorSchemeDark = this.colorSchemeDarkValue
    const colorScheme = this.colorSchemeValue

    // this.editor.setSize("100%", this.heightValue)
    // Sometimes the editor does not refresh/initialize properly, this prevents that
    // setTimeout(() => {
    //   this.editor.refresh()
    //
    //   if (colorScheme || colorSchemeDark) {
    //     if (colorSchemeDark && (window.matchMedia("prefers-color-scheme: dark").matches || document.documentElement.classList.contains("dark"))) {
    //       this.setTheme(colorSchemeDark)
    //     } else if (colorScheme) {
    //       this.setTheme(colorScheme)
    //     }
    //   }
    // }, 100)
    //
    // this.editor.on("change", function (editor, evt) {
    //   let event = new CustomEvent("editor.changed", { bubbles: true, cancelable: true, detail: { textarea: self.textareaTarget, editor: self.editor, dirty: !self.editor.getDoc().isClean() } })
    //   self.element.dispatchEvent(event)
    // })
  }

  sync () {
    this.textareaTarget.value = this.editor.state.doc.toString()
  }

  disconnect () {
    this.editor.destroy()
  }

}

//
// import "codemirror/addon/edit/closebrackets"
// import "codemirror/addon/edit/closetag"
// import "codemirror/addon/edit/matchtags"
//
// import "codemirror/addon/selection/active-line"
//
// import "codemirror/addon/mode/simple"
// import "codemirror/addon/mode/multiplex"
// import "codemirror/addon/dialog/dialog"
// import "codemirror/addon/search/searchcursor"
// import "codemirror/addon/search/search"
// import "codemirror/addon/search/jump-to-line"
// import "codemirror/addon/edit/matchtags"
// import "codemirror/addon/hint/html-hint"
// import "codemirror/addon/display/autorefresh"
// import "codemirror/addon/hint/show-hint"
// import "codemirror/addon/fold/foldgutter"
//
// import "codemirror/mode/htmlmixed/htmlmixed"
// import "codemirror/mode/slim/slim"
// import "codemirror/mode/javascript/javascript"
// import "codemirror/mode/slim/slim"
// import "codemirror/mode/css/css"
// import "codemirror/mode/sass/sass"
// import "codemirror/mode/markdown/markdown"
// import "codemirror/mode/ruby/ruby"
// import "codemirror/mode/xml/xml"
// import "codemirror/mode/yaml/yaml"
// import "codemirror/mode/yaml-frontmatter/yaml-frontmatter"
// import "codemirror/mode/sieve/sieve"
//
// import "codemirror-liquid"

// const themesContext = require.context("codemirror/theme", false, /\.css$/, "lazy")
// const themes = themesContext.keys().map((fileName) => fileName.slice(2, -4))

// import "codemirror/lib/codemirror.css";
// import "codemirror/addon/dialog/dialog.css";
// import "codemirror/addon/hint/show-hint.css";
// import "codemirror/addon/fold/foldgutter.css";

// import "codemirror/theme/3024-day.css";
// import "codemirror/theme/3024-night.css";