import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import {createPopper} from "@popperjs/core"
import {isPointInsideElement} from "../../../../frontend/utils"


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

      this.boundClickOutside = this.clickOutside.bind(this)
      this.boundMenuShow = this.menuShow.bind(this)
      this.boundMenuHide = this.menuHide.bind(this)
      this.boundMousemove = this.onMouseEvent.bind(this)

      document.addEventListener("mousedown", this.boundClickOutside)
      document.addEventListener("satis-menu:show", this.boundMenuShow)
      document.addEventListener("satis-menu:hide", this.boundMenuHide)

      this.submenuTarget.addEventListener("mouseover", this.boundMousemove)
      this.submenuTarget.addEventListener("mouseleave", this.boundMousemove)
      this.submenuTarget.addEventListener("mouseenter", this.boundMousemove)
    }

    if (this.hasClearTarget) {
      if (this.clearTarget.id == this.clearTarget.dataset.clear_id) {
        this.clearTarget.classList.toggle("hidden")
      }
    }

    this.element.addEventListener("mouseleave", this.boundMousemove)
  }

  disconnect() {
    super.disconnect()
    if (this.hasSubmenuTarget) {
      this.popperInstance.destroy()
      document.removeEventListener("mousedown", this.boundClickOutside)
      document.removeEventListener("satis-menu:show", this.boundMenuShow)
      document.removeEventListener("satis-menu:hide", this.boundMenuHide)

      this.submenuTarget.removeEventListener("mouseover", this.boundMousemove)
      this.submenuTarget.removeEventListener("mouseleave", this.boundMousemove)
      this.submenuTarget.removeEventListener("mouseenter", this.boundMousemove)

      this.element.removeEventListener("mouseleave", this.boundMousemove)
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

      this.previousMouseX = event.clientX
      this.previousMouseY = event.clientY
        const firstInputElement = this.popperInstance.state.elements.popper.querySelector('form input:not([type="hidden"])')
        const length = firstInputElement?.value.length;
        firstInputElement?.setSelectionRange(length, length);
        firstInputElement?.focus()

        document.dispatchEvent( new CustomEvent("satis-menu:show", {detail:{ src: this.submenuTarget }}))


      }
    event.stopPropagation()
  }

  hide(event) {
    if (this.hasSubmenuTarget) {
      this.submenuTarget.classList.add("hidden")
      this.submenuTarget.removeAttribute("data-show")

      const boundary = this.element.closest(".table-wrp")
      if (boundary) {
        boundary.style.minHeight = null;
      }
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

   isMouseInsideBounds(mouseX, mouseY, options = null) {
    if (!this.hasSubmenuTarget || !this.submenuTarget.hasAttribute("data-show")) return false
    const popperElement = this.popperInstance.state.elements.popper
    if (!popperElement) return false

    return isPointInsideElement(this.element, mouseX, mouseY, options) ||
      isPointInsideElement(popperElement, mouseX, mouseY, options)
  }

  menuShow(event){
    if (!this.element.contains(event.detail.src)) {
      this.hide(event)
    }
  }

  menuHide(event){
    if (this.element.contains(event.detail.src) || this.submenuTarget.contains(event.detail.src)) {
      if (!this.isMouseInsideBounds(event.clientX, event.clientY,{bufferSize: 3})) {
        this.hide(event)
        console.log("hide", event.detail.src)
      }
    }
  }

  onMouseEvent(event) {
    if (!event?.clientX || !event?.clientY) {
      return
    }

    const previousMouseX = this.previousMouseX
    const previousMouseY = this.previousMouseY

    if (!this.hasSubmenuTarget || !this.submenuTarget.hasAttribute("data-show")) return

    const popperElement = this.popperInstance.state.elements.popper
    const wasInside = this.isMouseInsideBounds(previousMouseX, previousMouseY)
    const isInside = isPointInsideElement(popperElement, event.clientX, event.clientY)

    if (wasInside && !isInside) {
      this.hide(event)
      this.triggerEvent(document, "satis-menu:hide", { src: this.element, clientX: event.clientX, clientY: event.clientY })
    }

    this.previousMouseX = event.clientX
    this.previousMouseY = event.clientY
  }

  clickOutside(event) {
    if (!this.hasSubmenuTarget || !this.submenuTarget.hasAttribute("data-show")) return
    const popperElement = this.popperInstance.state.elements.popper
    if (!popperElement) return

    if(!this.isMouseInsideBounds(event.clientX, event.clientY)) {
      this.hide(event)
    }
  }
}
