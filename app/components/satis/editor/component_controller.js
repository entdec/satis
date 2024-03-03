import ApplicationController from 'satis/controllers/application_controller'

import { basicSetup, EditorView } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'

import { json } from '@codemirror/lang-json'
import { yaml } from '@codemirror/lang-yaml'
import { liquid } from '@codemirror/lang-liquid'
import { markdown } from '@codemirror/lang-markdown'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { StateEffect } from '@codemirror/state'

/***
 * IDE - Editor controller
 *
 * Control codemirror
 */
export default class EditorComponentController extends ApplicationController {
  static targets = ['input']
  static values = {
    readOnly: { type: Boolean },
    lang: { type: String },
    height: { type: String, default: "8rem" },
    colorScheme: { type: String },
    colorSchemeDark: { type: String }
  }

  setTheme (theme) {
  }

  connect () {
    super.connect()
    const self = this

    const fixedHeightEditor = EditorView.theme({
      '&': { height: this.heightValue, maxHeight: this.heightValue },
      '.cm-gutter,.cm-content': { minHeight: this.heightValue },
      '.cm-scroller': { overflow: 'auto' },
      '&.cm-focused': {
        outline: 'none',
      },
    })

    let language = new Compartment

    this.editor = new EditorView({
      doc: this.inputTarget.value,
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
    })
    this.editor.dispatch({
      effects: StateEffect.appendConfig.of(language.of(this._getLanguage(this.langValue || 'html')))
    })

    const colorSchemeDark = this.colorSchemeDarkValue
    const colorScheme = this.colorSchemeValue
  }

  sync () {
    this.inputTarget.value = this.editor.state.doc.toString()
  }

  disconnect () {
    this.editor.destroy()
  }

  _getLanguage (lang) {
    const languageMapping = {
      'yaml': yaml(),
      'json': json(),
      'liquid': liquid(),
      'markdown': markdown(),
      'javascript': javascript(),
      'html': html(),
      'css': css(),
    }
    return languageMapping[lang]
  }

}