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
      const sidebar = this.element.closest('.sidebar')
      sidebar.dispatchEvent(new CustomEvent('sts-sidebar-menu-item:open', { detail: { element: this.element } }))

      if (!this.isSubmenuVisible) {
        this.showSubmenu()
        event.preventDefault()
      } else {
        if(!this.hasLink || this.linkInUrl()) this.hideSubmenu()
      }

      if(this.linkInUrl()){
        event.preventDefault()
      }
    }
    event.stopPropagation();
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

  get hasLink(){
    return this.hasLinkTarget && this.linkTarget.hasAttribute("href")
  }

  updateFocus(scroll = false) {
    if (!this.hasLink) return
    const focusedItem =  this.element.closest('.sidebar').querySelector('a.focus')
    const linkInUrl = this.linkInUrl()
    if (linkInUrl && (!focusedItem || linkInUrl > this.linkInUrl(focusedItem))) {
      focusedItem?.classList.toggle("focus", false)
      this.linkTarget.classList.toggle("focus", true)
      if (scroll) this.linkTarget.scrollIntoView({ behavior: 'instant', block: 'nearest' })
    } else
      this.linkTarget.classList.toggle("focus", false)
  }

  linkInUrl(target = this.linkTarget) {
    if(!target || target.getAttribute('href') === null  || target.pathname !== window.location.pathname || target.origin !== window.location.origin)
      return 0

    let c = 1;
    if(target.hash === window.location.hash) c++
    window.location.search.split('&').forEach((param) => {if (target.search.includes(param)) c+=2})
    return c
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
