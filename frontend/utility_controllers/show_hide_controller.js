import ApplicationController from "../controllers/application_controller"

/*
  Usage:

  <div data-controller="show-hide">
    <input type="checkbox" data-show-hide-target="input" />
    <div data-show-hide-showable="true" data-show-hide-value="true">
      This is shown when the show-hide.input value equates to true, it is hidden otherwise
    </div>
  </div>
 */
export default class extends ApplicationController {
  static targets = ["showable", "input"]

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
    this.showableTargets.forEach((element) => {
      if (element.getAttribute("data-show-hide-value") == value) {
        element.classList.remove("hidden")
      } else {
        element.classList.add("hidden")
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
