import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

export default class extends ApplicationController {
  static targets = ["link", "indicator", "submenu"]
  connect() {
    super.connect()

    this.debouncedOpenMenu = debounce(this.openMenu.bind(this), 500)
    this.debouncedCloseMenu = debounce(this.closeMenu.bind(this), 500)

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
        this.indicatorTarget.classList.add("rotate-90")
      }
    }
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
    if (this.linkTarget.matches(":hover") || this.isActive) {
      this.linkTarget.classList.add("active")
      this.submenuTarget.classList.remove("hidden")
      this.indicatorTarget.classList.add("rotate-90")
    }
  }

  closeMenu(event) {
    if (!this.linkTarget.matches(":hover") && !this.isActive) {
      this.linkTarget.classList.remove("active")
      this.indicatorTarget.classList.remove("rotate-90")
      this.submenuTarget.classList.add("hidden")
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
    })
  }

  get hasActiveLinks() {
    return Array.from(this.element.querySelectorAll('[data-satis-sidebar-menu-item-target="link"]')).some((el) => {
      return el.classList.contains("active")
    })
  }
}
