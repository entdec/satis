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
    this.boundShowFlyout = this.showFlyout.bind(this)
    this.boundHideFlyout = this.hideFlyout.bind(this)
    this.hideTimer = null

    this.updateFocus(true)
    this.element.addEventListener('sts-sidebar-menu-item:open', this.boundOpenListener)
    this.element.addEventListener('mouseenter', this.boundShowFlyout)
    this.element.addEventListener('mouseleave', this.boundHideFlyout)
    window.addEventListener('popstate', debounce(this.boundUpdateFocus, 200))
  }

  disconnect() {
    super.disconnect()
    clearTimeout(this.hideTimer)
    this.element.removeEventListener('sts-sidebar-menu-item:open', this.boundOpenListener)
    this.element.removeEventListener('mouseenter', this.boundShowFlyout)
    this.element.removeEventListener('mouseleave', this.boundHideFlyout)
    window.removeEventListener('popstate', debounce(this.boundUpdateFocus, 200))
  }

  // ── Collapsed sidebar flyout logic ──

  get isSidebarClosed() {
    const sidebar = this.element.closest('.sidebar')
    return sidebar?.classList.contains('close')
  }

  get isInsideFlyout() {
    return !!this.element.closest('[data-satis-sidebar-menu-item-target="submenu"].flyout-visible')
  }

  showFlyout() {
    if (!this.isSidebarClosed) return

    // Cancel any pending hide
    clearTimeout(this.hideTimer)

    if (this.hasSubmenuTarget) {
      const submenuLabel = this.element.querySelector(':scope > .sts-sidebar-menu-item__link > .submenu-label')

      this.submenuTarget.classList.add('flyout-visible')
      if (submenuLabel) submenuLabel.classList.add('tooltip-visible')

      this.positionFlyout(this.submenuTarget, submenuLabel)
    } else if (!this.isInsideFlyout) {
      const label = this.element.querySelector(':scope > .sts-sidebar-menu-item__link > .sts-sidebar-menu-item__label:not(.submenu-label)')
      if (label) {
        label.classList.add('tooltip-visible')
        this.positionWithinViewport(label)
      }
    }
  }

  hideFlyout() {
    if (!this.isSidebarClosed) return

    // Delay hiding so the user can move to the flyout without it disappearing
    this.hideTimer = setTimeout(() => {
      if (this.hasSubmenuTarget) {
        this.submenuTarget.classList.remove('flyout-visible')
        this.submenuTarget.style.top = ''
      }

      this.element.querySelectorAll('.tooltip-visible').forEach(el => {
        el.classList.remove('tooltip-visible')
        el.style.top = ''
      })
    }, 150)
  }

  positionFlyout(flyout, label) {
    requestAnimationFrame(() => {
      const flyoutRect = flyout.getBoundingClientRect()
      if (flyoutRect.height === 0) return

      const viewportHeight = window.innerHeight
      const margin = 8
      const labelHeight = label ? label.getBoundingClientRect().height : 0

      let flyoutTop = parseFloat(getComputedStyle(flyout).top) || 0

      // Check if flyout overflows bottom
      if (flyoutRect.bottom > viewportHeight - margin) {
        const overflow = flyoutRect.bottom - viewportHeight + margin
        flyoutTop -= overflow
      }

      // Check if label above flyout would overflow top
      const parentRect = flyout.offsetParent?.getBoundingClientRect()
      const parentTop = parentRect?.top || 0
      if (parentTop + flyoutTop - labelHeight < margin) {
        flyoutTop = margin - parentTop + labelHeight
      }

      flyout.style.top = `${flyoutTop}px`

      // Position label flush against the top of the flyout panel (no gap)
      if (label) {
        label.style.top = `${flyoutTop - labelHeight}px`
      }
    })
  }

  positionWithinViewport(el) {
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      if (rect.height === 0) return

      const viewportHeight = window.innerHeight
      const margin = 8

      if (rect.bottom > viewportHeight - margin) {
        const overflow = rect.bottom - viewportHeight + margin
        const currentTop = parseFloat(getComputedStyle(el).top) || 0
        el.style.top = `${currentTop - overflow}px`
      }

      if (rect.top < margin) {
        el.style.top = `${margin - el.parentElement.getBoundingClientRect().top}px`
      }
    })
  }

  // ── Submenu expand/collapse (expanded sidebar) ──

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
  }

  openListener(event) {
    if (event.detail.element !== this.element && !this.element.contains(event.detail.element)) {
      this.hideSubmenu()
      this.linkTarget.classList.toggle("focus", false)
    }
  }

  showSubmenu() {
    if (!this.hasSubmenuTarget || this.isSubmenuVisible) return

    this.submenuTarget.classList.toggle("hidden", false)
    this.element.classList.toggle("active", true)
  }

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

  get openSubmenus() {
    return this.element.querySelectorAll('[data-satis-sidebar-menu-item-target="submenu"]:not([class*="hidden"])')
  }

}
