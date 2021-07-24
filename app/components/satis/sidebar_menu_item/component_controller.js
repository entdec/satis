import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

export default class extends ApplicationController {
  static targets = ["link", "indicator", "submenu"]
  connect() {
    super.connect()

    this.debouncedOpenMenu = debounce(this.openMenu.bind(this), 500)
    this.debouncedCloseMenu = debounce(this.closeMenu.bind(this), 500)
  }

  open(event) {
    if (this.hasSubmenuTarget) {
      this.debouncedOpenMenu(event)
    }
  }

  close(event) {
    if (this.hasSubmenuTarget) {
      this.debouncedCloseMenu(event)
    }
  }

  openMenu(event) {
    if (this.linkTarget.matches(":hover")) {
      this.submenuTarget.classList.remove("hidden")
      this.indicatorTarget.classList.add("rotate-90")
    }
  }

  closeMenu(event) {
    if (!this.linkTarget.matches(":hover")) {
      this.indicatorTarget.classList.remove("rotate-90")
      this.submenuTarget.classList.add("hidden")
    }
  }
}
