import ApplicationController from "../controllers/application_controller"

/*
  Usage:

  <div data-controller="toggle" data-toggle-attr='data-serialized'>
    <select data-toggle-target='input'>
      <option value="PN1" data-serialized="N">PN1</option>
      <option value="PN2" data-serialized="Y">PN2</option>
    </select>
    <div data-toggle-target="insertion"></div>
    <template data-toggle-target="toggleable" data-toggle-value='N'>
      <input name="quantity">
    </template>
    <template data-toggle-target="toggleable" data-toggle-value='Y'>
      <input name="serial_number">
    </template>
  </div>

  Usage with slim and checkbox:

  .site-company-wrapper data-controller='toggle'
    = address_form.input :company, input_html: { 'data-toggle-target': 'input' }
    div data-toggle-target='insertion'
    template data-toggle-target='toggleable' data-toggle-value='true'
      = address_form.input :company_name
 */
export default class extends ApplicationController {
  static targets = ["toggleable", "insertion", "input"]

  connect() {
    this.boundUpdate = this.update.bind(this)
    this.inputTarget.addEventListener("change", this.boundUpdate)
    this.update()
  }

  disconnect() {
    this.inputTarget.removeEventListener("change", this.boundUpdate)
  }

  update() {
    this.toggle(this.currentValue)
  }

  toggle(value) {
    // FIXME: We should capture the current content and update the template it came from.
    this.insertionTarget.innerHTML = ""
    this.toggleableTargets.forEach((element) => {
      if (element.getAttribute("data-toggle-value") == value || (element.getAttribute("data-toggle-not-value") != null && element.getAttribute("data-toggle-not-value") != value)) {
        let toggleContent = document.importNode(element.content, true)
        toggleContent.childNodes.forEach((child) => {
          this.insertionTarget.insertAdjacentHTML("beforeend", child.outerHTML)
        })
      }
    })
  }

  get currentValue() {
    if (this.inputTarget.type == "checkbox") {
      return this.inputTarget.checked ? "true" : "false"
    } else if (this.inputTarget.tagName == "SELECT" && this.data.get("attr")) {
      let option = this.inputTarget.options[this.inputTarget.selectedIndex]
      return option.getAttribute(this.data.get("attr"))
    } else {
      return this.inputTarget.value
    }
  }
}
