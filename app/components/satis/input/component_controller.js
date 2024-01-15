import ApplicationController from "../../../../frontend/controllers/application_controller"

export default class extends ApplicationController {
  static targets = ["input"]
  static values = {}

  connect() {
    super.connect()

    if (this.hasInputTarget) {
      document.addEventListener("wheel", function (event) {
        if (document.activeElement.type === "number" && document.activeElement.classList.contains("noscroll")) {
          document.activeElement.blur()
        }
      })
    }
  }

  disconnect() {}
}
