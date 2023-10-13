import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"
import { createPopper } from "@popperjs/core"

export default class extends ApplicationController {
  static targets = ["submenu", "toggle", "clear"]

  connect() {
    super.connect()

    if (this.hasSubmenuTarget) {
      this.popperInstance = createPopper(this.element, this.submenuTarget, {
        placement: this.submenuTarget.getAttribute("data-satis-menu-submenu-placement") || "auto",
        strategy: this.submenuTarget.getAttribute("data-satis-menu-submenu-strategy") || "fixed",
        modifiers: [
          { name: "offset", options: { offset: [0, 0] } },
          {
            name: "flip",
            enabled: true,
            options: {
              fallbackPlacements: ["top", "right"],
              boundary: this.element.closest(".table-wrp"),
              rootBoundary: this.element.closest(".table-wrp")
            },
          },
          {
            name: "preventOverflow",
            options: {
              altAxis: true,
              altBoundary: true,
              boundary: this.element.closest(".table-wrp"),
              rootBoundary: this.element.closest(".table-wrp")
            },
          },
        ],
      })
    }

    if(this.hasClearTarget) {
      let data = JSON.parse(this.clearTarget.dataset.show_params)
      if (this.clearTarget.id == "group_" + data.current_view + "_" + data.group_by_column) {
        this.clearTarget.classList.toggle("hidden")
      }
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
      this.triggerEvent(this.toggleTarget, "toggle", {
        toggled: !this.toggleTarget.classList.contains("hidden"),
        id: this.toggleTarget.getAttribute("id"),
      })
      if (this.toggleTarget.classList.contains("hidden")) {
        this.hide(event)
      } else {
        this.show(event)
      }
    }

    if (this.hasClearTarget) {
      let elements  = document.getElementsByClassName('clear-icon')
      Array.from(elements).forEach(function (element) {
        element.classList.add('hidden')
      });

      if ((event.currentTarget != this.clearTarget && this.clearTarget.classList.contains("hidden")) ||
          (event.currentTarget == this.clearTarget && !this.clearTarget.classList.contains("hidden")) ) {
        this.clearTarget.classList.toggle("hidden")
      }
    }
  }

  get toggledOn() {
    return !this.toggleTarget.classList.contains("hidden")
  }
}
