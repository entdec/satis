import ApplicationController from 'satis/controllers/application_controller'

import { basicSetup, EditorView } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'

import {json} from "@codemirror/lang-json"
import {yaml} from "@codemirror/lang-yaml"
import {liquid} from "@codemirror/lang-liquid"
import {markdown} from "@codemirror/lang-markdown"
import {javascript} from "@codemirror/lang-javascript"
import {html} from "@codemirror/lang-html"
import {css} from "@codemirror/lang-css"

/***
 * IDE - Editor controller
 *
 * Control codemirror
 */
export default class EditorComponentController extends ApplicationController {
  static targets = ['input']
  static values = { readOnly: Boolean, lang: String, height: String, colorScheme: String, colorSchemeDark: String }

  setTheme (theme) {
  }

  connect () {
    super.connect()
    const self = this

    const fixedHeightEditor = EditorView.theme({
      '&': { height: '8rem', maxHeight: '8rem' },
      '.cm-gutter,.cm-content': { minHeight: '8rem' },
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
        language.of(this._getLanguage(this.langValue||'html')),
        EditorState.readOnly.of(this.readOnlyValue),
        EditorView.updateListener.of((view) => {
          if (view.docChanged) { this.sync() }
        })
      ],
      parent: this.element,
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

  _getLanguage(lang) {
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