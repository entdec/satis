import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import {createPopper} from "@popperjs/core"


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
              fallbackPlacements: ["bottom"],
              boundary: this.element.closest(".table-wrp") || this.element.closest(".sts-card"),
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: this.element.closest(".table-wrp") || this.element.closest(".sts-card"),
            },
          },
        ],
      })
      this.popperInstance.state.elements.popper.popperInstance = () => this.popperInstance

      this.mutationObserver = new MutationObserver((mutationsList, observer) => {
        this.updateBoundary()
      });
      this.mutationObserver?.observe(this.popperInstance.state.elements.popper, {
        childList: true,
        subtree: true,
        attributes: true
      });

    }

    if (this.hasClearTarget) {
      if (this.clearTarget.id == this.clearTarget.dataset.clear_id) {
        this.clearTarget.classList.toggle("hidden")
      }
    }

    this.boundClickOutside = this.clickOutside.bind(this)
    document.addEventListener("click", this.boundClickOutside)

    this.boundMouseleave = this.hide.bind(this)
    this.element.addEventListener("mouseleave", this.boundMouseleave)
  }

  disconnect() {
    super.disconnect()
    if (this.hasSubmenuTarget) {
      this.popperInstance.destroy()
      document.removeEventListener("click", this.boundClickOutside)
      this.element.removeEventListener("mouseleave", this.boundMouseleave)
    }
    this.mutationObserver?.disconnect()
  }

  show(event) {
    if (this.hasSubmenuTarget && !this.submenuTarget.hasAttribute("data-show") && (!this.hasToggleTarget || (this.hasToggleTarget && this.toggledOn))) {
        this.submenuTarget.classList.remove("hidden")
        this.submenuTarget.setAttribute("data-show", "")
        this.popperInstance.update()
        this.element.querySelectorAll("[data-popper-reference-hidden]").forEach(element => {
          if (element.hasOwnProperty("popperInstance")) {
            element.popperInstance().update()
          }
        })

        const firstInputElement = this.popperInstance.state.elements.popper.querySelector('form input:not([type="hidden"])')
        const length = firstInputElement?.value.length;
        firstInputElement?.setSelectionRange(length, length);
        firstInputElement?.focus()
      }
    event.stopPropagation()
  }

  hide(event) {
    if(event && event.type === "mouseleave" &&
      (event.target?.getAttribute("data-act-table-target") === "loadingOverlay" ||
      event.relatedTarget?.getAttribute("data-act-table-target") === "loadingOverlay")){
      return
    }

    if (this.hasSubmenuTarget && this.submenuTarget.hasAttribute("data-show")) {
      this.submenuTarget.classList.add("hidden")
      this.submenuTarget.removeAttribute("data-show")

      const boundary = this.element.closest(".table-wrp")
      if (boundary) {
        boundary.style.minHeight = null;
      }
    }
    //event?.stopPropagation() //commented to fix issue with date picker not auto closing on clicking outside
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
      let elements = document.getElementsByClassName('clear-icon')
      Array.from(elements).forEach(function (element) {
        element.classList.add('hidden')
      });

      if ((event.currentTarget != this.clearTarget && this.clearTarget.classList.contains("hidden")) ||
        (event.currentTarget == this.clearTarget && !this.clearTarget.classList.contains("hidden"))) {
        this.clearTarget.classList.toggle("hidden")
      }
    }
  }


  updateBoundary() {
    const boundary = this.element.closest(".table-wrp")
    if (!boundary) return
    const maxHeight = parseInt(window.getComputedStyle(boundary).maxHeight.replace("px", ""))
    const popperElement = this.popperInstance.state.elements.popper
    if (!popperElement || popperElement.hasAttribute("data-popper-reference-hidden")) return

    // ensure the boundary fits the popper by changing its min-height
    const popperHeight = popperElement.scrollHeight
    const popperTopRelativeToBoundary = popperElement.getBoundingClientRect().top - boundary.getBoundingClientRect().top
    const scrollTop = popperElement.scrollTop
    const newHeight = scrollTop + popperTopRelativeToBoundary + popperHeight + 20
    const minimumHeight = Math.min(newHeight, maxHeight)
    if (boundary.offsetHeight < minimumHeight) {
      boundary.style.minHeight = `${minimumHeight}px`
      setTimeout(() => {
        boundary.scrollIntoView( { behavior: "instant", block: "nearest", inline: "nearest" })
      }, 100)
    }
  }

  get toggledOn() {
    return !this.toggleTarget.classList.contains("hidden")
  }

  clickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.hide(event)
    }
  }

}
