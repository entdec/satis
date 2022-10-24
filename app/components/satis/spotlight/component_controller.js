import ApplicationController from "../../../../frontend/controllers/application_controller"

export default class extends ApplicationController {
  static targets = ["input"]

  static keyBindings = [
    {
      global: true,
      keys: ["alt+p", "alt+shift+p"],
      handler: (event, combo, controller) => {
        controller.open(event)
        event.preventDefault()
      },
    },
  ]

  open(event) {
    this.element.classList.remove("hidden")
    this.inputTarget.focus()
    if (this.inputTarget.value.length > 0) {
      setTimeout(() => {
        this.inputTarget.setSelectionRange(0, this.inputTarget.value.length)
      }, 100)
    }
  }
  close(event) {
    this.element.classList.add("hidden")
    this.inputTarget.blur()
  }
  escClose(event) {
    if (event.keyCode == 27) {
      this.close(event)
      this.inputTarget.blur()
    }
  }
}
