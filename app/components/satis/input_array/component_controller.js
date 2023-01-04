import ApplicationController from "../../../../frontend/controllers/application_controller"

export default class extends ApplicationController {
  static targets = ["rowsContainer", "inputRow", "rowTemplate"]
  static values = { inputName: String }

  connect() {
    super.connect()
  }

  disconnect() {}

  removeRow(event) {
    event.preventDefault()
    event.currentTarget.parentElement.parentElement.remove()
  }

  addRow(event) {
    event.preventDefault()

    const rowTemplate = this.rowTemplateTarget.content.firstElementChild.cloneNode(true)
    const inputControl = rowTemplate.querySelector("input")
    inputControl.setAttribute("name", this.inputNameValue)

    this.rowsContainerTarget.appendChild(rowTemplate)
  }

  input(event) {
    if (
      Array.from(this.rowsContainerTarget.children).indexOf(event.currentTarget.parentElement.parentElement) + 1 ==
      this.inputRowTargets.length
    ) {
      this.addRow(event)
    }
  }
}
