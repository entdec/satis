import ApplicationController from "satis/controllers/application_controller"
import { debounce } from "satis/utils"

export default class SidebarMenuItemComponentController extends ApplicationController {
  static targets = ["link", "indicator", "submenu"]

  connect() {
    super.connect()
  }

  open(event) {
    if (!this.isActive && this.hasSubmenuTarget) {
      if (this.hasSubmenuTarget) {
        this.submenuTarget.classList.remove("hidden")
        this.indicatorTarget.setAttribute("data-fa-transform", "rotate-90")
      }
      event.preventDefault()
    }
    else {
        if(this.linkInUrl || (this.linkTarget.href.length <= 0 && !this.hasActiveLinks)){
          if (this.hasSubmenuTarget){
            this.submenuTarget.classList.toggle("hidden")
            if(!this.submenuTarget.classList.contains("hidden") && !this.indicatorTarget.hasAttribute("data-fa-transform")){
              this.indicatorTarget.setAttribute("data-fa-transform", "rotate-90")
            } else{
              this.indicatorTarget.removeAttribute("data-fa-transform", "rotate-90")
            }
            event.preventDefault()

          }
        }
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
