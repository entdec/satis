import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

export default class extends ApplicationController {
  static targets = ["hiddenInput", "switch", "button", "cross", "check"]

  connect() {
    super.connect()
  }

  toggle(event) {
    if (event && event.detail && event.detail.src != this) {
      this.hiddenInputTarget.dispatchEvent(new CustomEvent("change", { detail: { src: this } }))
      this.hiddenInputTarget.value = this.hiddenInputTarget.value == "1" ? "0" : "1"
    }
    this._update()
  }

  _update() {
    if (this.hiddenInputTarget.value == "1") {
      // enabled
      this.buttonTarget.classList.add("bg-blue-600")
      this.buttonTarget.classList.remove("bg-gray-200")
      this.switchTarget.classList.add("translate-x-5")
      this.switchTarget.classList.remove("translate-x-0")

      if (this.hasCrossTarget && this.hasCheckTarget) {
        this.crossTarget.classList.add("opacity-0", "ease-out", "duration-100")
        this.checkTarget.classList.add("opacity-100", "ease-in", "duration-200")

        this.crossTarget.classList.remove("opacity-100", "ease-in", "duration-200")
        this.checkTarget.classList.remove("opacity-0", "ease-out", "duration-100")
      }
    } else {
      // disabled
      this.buttonTarget.classList.remove("bg-blue-600")
      this.buttonTarget.classList.add("bg-gray-200")
      this.switchTarget.classList.remove("translate-x-5")
      this.switchTarget.classList.add("translate-x-0")

      if (this.hasCrossTarget && this.hasCheckTarget) {
        this.crossTarget.classList.remove("opacity-0", "ease-out", "duration-100")
        this.checkTarget.classList.remove("opacity-100", "ease-in", "duration-200")

        this.crossTarget.classList.add("opacity-100", "ease-in", "duration-200")
        this.checkTarget.classList.add("opacity-0", "ease-out", "duration-100")
      }
    }
  }
}
