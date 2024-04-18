import ApplicationController from "satis/controllers/application_controller"
import {debounce} from "satis/utils"

export default class SidebarMenuItemComponentController extends ApplicationController {
  static targets = ["link", "indicator", "submenu"]

  connect() {
    super.connect()
    if (this.hasSubmenuTarget) {
      const active = this.isActive
      if (active) {
        this.showSubmenu()
      }
    }

    this.boundUpdateFocus = this.updateFocus.bind(this)
    this.boundOpenListener = this.openListener.bind(this)

    this.updateFocus(true)
    this.element.addEventListener('sts-sidebar-menu-item:open', this.boundOpenListener)
    window.addEventListener('popstate', debounce(this.boundUpdateFocus, 200))
  }

  disconnect() {
    super.disconnect()
    this.element.removeEventListener('sts-sidebar-menu-item:open', this.boundOpenListener)
    window.removeEventListener('popstate', debounce(this.boundUpdateFocus, 200))
  }

  open(event) {
    if (this.hasSubmenuTarget) {
      const sidebar = this.element.closest('nav.sidebar')
      sidebar.dispatchEvent(new CustomEvent('sts-sidebar-menu-item:open', { detail: { element: this.element } }))


      if (!this.isSubmenuVisible) {
        this.showSubmenu()
      } else {
        this.hideSubmenu()
      }
      if (this.linkInUrl()) {
        event.preventDefault()
      }
    }
  }

  openListener(event) {
    if (event.detail.element !== this.element && !this.element.contains(event.detail.element)) {
      this.hideSubmenu()
      this.linkTarget.classList.toggle("focus", false)
    }
  }

  // This method is used to show the submenu
  showSubmenu() {
    if (!this.hasSubmenuTarget || this.isSubmenuVisible) return

    this.submenuTarget.classList.toggle("hidden", false)
    this.element.classList.toggle("active", true)
  }

  // This method is used to hide the submenu
  hideSubmenu() {
    if (!this.hasSubmenuTarget || !this.isSubmenuVisible) return

    this.submenuTarget.classList.toggle("hidden", true)
    this.element.classList.toggle("active", false)
  }

  updateFocus(scroll = false) {
    if (!this.hasLinkTarget) return
    if (this.linkInUrl()) {
      this.linkTarget.classList.toggle("focus", true)
      if (scroll) this.linkTarget.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    } else
      this.linkTarget.classList.toggle("focus", false)
  }

  linkInUrl(target = this.linkTarget) {
    return target.href.length > 0 &&
      (target.search.length === 0 || target.search === window.location.search) &&
      (target.hash.length === 0 || target.hash === window.location.hash) &&
      target.pathname === window.location.pathname &&
      target.origin === window.location.origin
  }

  get isActive() {
    return this.linkInUrl() || this.element.classList.contains("active")
      || Array.from(this.element.querySelectorAll('a[data-satis-sidebar-menu-item-target="link"]'))
        .some((link) => link.classList.contains("active") || this.linkInUrl(link))
  }

  get isSubmenuVisible() {
    return !this.submenuTarget.classList.contains("hidden")
  }

  get hasOpenSubmenus() {
    return this.openSubmenus.length > 0
  }

  /**
   * Get a list of all open submenus
   * @returns {NodeListOf<Element>}
   */
  get openSubmenus() {
    // scope to first match. check if there are any submenus that are not hidden
    return this.element.querySelectorAll('[data-satis-sidebar-menu-item-target="submenu"]:not([class*="hidden"])')
  }

}
