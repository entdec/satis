import ApplicationController from "satis/controllers/application_controller"

export default class FileController extends ApplicationController {
  static targets = ["selection", "input"]

  connect() {
    this.boundUpdate = this.update.bind(this)
    this.inputTarget.addEventListener("change", this.boundUpdate)
    this.update()
  }

  disconnect() {
    this.inputTarget.removeEventListener("change", this.boundUpdate)
  }

  update(evt) {
    this.selectionTarget.innerHTML = ""
    Array.from(this.inputTarget.files).forEach((file) => {
      this.selectionTarget.innerHTML += `${file.name}<br>`
    })
  }

  toggle(value) {
    // FIXME: We should capture the current content and update the template it came from.
  }
}
