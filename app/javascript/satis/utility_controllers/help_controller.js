import tippy from "tippy.js"

import ApplicationController from "satis/controllers/application_controller"

export default class extends ApplicationController {
  static values = { content: String }

  connect() {
    const self = this
    tippy(this.element, {
      content: (reference) => this.contentValue,
      allowHTML: true,
      // trigger: "click",
      interactive: true,
      appendTo: () => document.body,
    })
  }
}
