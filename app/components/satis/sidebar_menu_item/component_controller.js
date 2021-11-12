import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

export default class extends ApplicationController {
  static targets = ["link", "indicator", "submenu"]

  connect() {
    super.connect()

    // Primitive, yes
    Array.from(this.element.querySelectorAll('[data-satis-sidebar-menu-item-target="link"]')).forEach((el) => {
      if (el.href.length > 0 && window.location.href.indexOf(el.href) >= 0) {
        el.classList.add("active")
      }
    })

    if (this.isActive) {
      this.linkTarget.classList.add("active")

      if (this.hasSubmenuTarget) {
        this.submenuTarget.classList.remove("hidden")
        this.indicatorTarget.setAttribute("data-fa-transform", "rotate-90")
      } else {
        this.linkTarget.classList.add("focus")
      }
    }
  }

  open(event) {
    if (!this.isActive && this.hasSubmenuTarget) {
      if (this.hasSubmenuTarget) {
        this.submenuTarget.classList.remove("hidden")
        this.indicatorTarget.setAttribute("data-fa-transform", "rotate-90")
      }
      event.preventDefault()
    }
  }

  get linkInUrl() {
    return this.linkTarget.href.length > 0 && window.location.href.indexOf(this.linkTarget.href) >= 0
  }

  get isActive() {
    return this.linkInUrl || this.hasOpenSubmenus || this.hasActiveLinks
  }

  get hasOpenSubmenus() {
    return Array.from(this.element.querySelectorAll('[data-satis-sidebar-menu-item-target="submenu"]')).some((el) => {
      return !el.classList.contains("hidden")
      // return Array.from(el.querySelectorAll('[data-satis-sidebar-menu-item-target="submenu"]')).some((el) => {
      //   return !el.classList.contains("hidden")
      // })
    })
  }

  get hasActiveLinks() {
    return Array.from(this.element.querySelectorAll('[data-satis-sidebar-menu-item-target="link"]')).some((el) => {
      return el.classList.contains("active")
    })
  }
}
