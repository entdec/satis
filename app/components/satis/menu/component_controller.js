import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"
import { createPopper } from "@popperjs/core"

export default class extends ApplicationController {
  static targets = ["submenu", "toggle"]

  connect() {
    super.connect()

    if (this.hasSubmenuTarget) {
      this.popperInstance = createPopper(this.element, this.submenuTarget, {
        offset: [-20, 2],
        placement: this.submenuTarget.getAttribute("data-satis-menu-submenu-placement") || "auto",
        modifiers: [
          {
            name: "flip",
            enabled: true,
            options: {
              boundary: this.element.closest(".sts-card"),
            },
          },
          {
            name: "preventOverflow",
          },
        ],
      })
    }
  }

  show(event) {
    if (this.hasSubmenuTarget && (!this.hasToggleTarget || (this.hasToggleTarget && this.toggledOn))) {
      this.submenuTarget.classList.remove("hidden")
      this.submenuTarget.setAttribute("data-show", "")
      this.popperInstance.update()
    }
    event.stopPropagation()
  }

  hide(event) {
    if (this.hasSubmenuTarget) {
      this.submenuTarget.classList.add("hidden")
      this.submenuTarget.removeAttribute("data-show")
    }
    event.stopPropagation()
  }

  toggle(event) {
    if (this.hasToggleTarget) {
      this.toggleTarget.classList.toggle("hidden")
      this.triggerEvent(this.toggleTarget, "toggle", { toggled: !this.toggleTarget.classList.contains("hidden"), id: this.toggleTarget.getAttribute("id") })
      if (this.toggleTarget.classList.contains("hidden")) {
        this.hide(event)
      } else {
        this.show(event)
      }
    }
  }

  get toggledOn() {
    return !this.toggleTarget.classList.contains("hidden")
  }
}
