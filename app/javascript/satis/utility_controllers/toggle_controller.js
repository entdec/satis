import ApplicationController from "satis/controllers/application_controller"

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
    this.inputTargets.forEach((input) => {
      input.addEventListener("change", this.boundUpdate)
    })
    this.update()
  }

  disconnect() {
    this.inputTargets.forEach((input) => {
      input.removeEventListener("change", this.boundUpdate)
    })
  }

  update(event) {
    /* FIXME: There should be a more cleaner way of doing this?
     * Make sure that the toggle happens after the event bubble so any listeners are able to
     * process before we overwrite the template nodes that are possibly updated and reinsert new nodes.
     */
    setTimeout(() => {
      this.toggle(this.currentValue)
    })
  }

  toggle(value) {
    // Update template nodes before we swap
    this.toggleableTargets.forEach((target) => {
      target.content.childNodes.forEach(child => {
        let targetNodeId = child.getAttribute("data-toggleable-node-id")
        if (!targetNodeId) return true;

        this.insertionTarget.childNodes.forEach(iNode => {
          if (iNode.getAttribute("data-toggleable-node-id") == targetNodeId) {
            if (child.parentElement) {
              child.outerHTML = iNode.outerHTML
              iNode.remove()
            }
          }
        })
      })
    })

    // Clear the insertion target
    this.insertionTarget.innerHTML = ""

    // Reinsert elements
    this.toggleableTargets.forEach((element) => {
      if (element.getAttribute("data-toggle-value") == value || (element.getAttribute("data-toggle-not-value") != null && element.getAttribute("data-toggle-not-value") != value)) {
        element.content.childNodes.forEach(node => this.setUniqueId(node))

        let toggleContent = document.importNode(element.content, true)
        toggleContent.childNodes.forEach((child) => {
          this.insertionTarget.insertAdjacentHTML("beforeend", child.outerHTML)
        })
      }
    })
  }

  get currentValue() {
    if (this.inputTargets.length >= 1 && this.inputTargets[0].type == "radio") {
      return this.inputTargets.find((input) => input.checked)?.value
    } else if (this.inputTarget.type == "checkbox") {
      return this.inputTarget.checked ? "true" : "false"
    } else if (this.inputTarget.tagName == "SELECT" && this.data.get("attr")) {
      let option = this.inputTarget.options[this.inputTarget.selectedIndex]
      return option?.getAttribute(this.data.get("attr"))
    } else {
      return this.inputTarget.value
    }
  }

  setUniqueId(node) {
    if (node.getAttribute("data-toggleable-node-id")) return;
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    node.setAttribute("data-toggleable-node-id", dateString + randomness)
  }
}
