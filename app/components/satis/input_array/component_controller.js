import ApplicationController from "satis/controllers/application_controller"

export default class InputArrayComponentController extends ApplicationController {
  static targets = ["rowsContainer", "inputRow", "rowTemplate", "crossButton", "plusButton"]
  static values = { inputName: String }

  connect() {
    super.connect()

    this.updateAddRemoveButtons()
  }

  disconnect() {}

  removeRow(event) {
    event.preventDefault()
    event.currentTarget.parentElement.parentElement.remove()

    this.updateAddRemoveButtons()
  }

  addRow(event) {
    event.preventDefault()

    const rowTemplate = this.rowTemplateTarget.content.firstElementChild.cloneNode(true)
    const inputControl = rowTemplate.querySelector("input")
    inputControl.setAttribute("name", this.inputNameValue)

    this.rowsContainerTarget.appendChild(rowTemplate)

    this.updateAddRemoveButtons()
  }

  input(event) {
    if (
      Array.from(this.rowsContainerTarget.children).indexOf(event.currentTarget.parentElement.parentElement) + 1 ==
      this.inputRowTargets.length
    ) {
      this.addRow(event)
    }
  }

  updateAddRemoveButtons() {
    this.inputRowTargets.forEach((inputRow, i) => {
      if (i + 1 == this.inputRowTargets.length) {
        inputRow.querySelector(".crossButton").classList.add("hidden")
        inputRow.querySelector(".plusButton").classList.remove("hidden")
      } else {
        inputRow.querySelector(".crossButton").classList.remove("hidden")
        inputRow.querySelector(".plusButton").classList.add("hidden")
      }
    })
  }
}
