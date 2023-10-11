import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"
import { createPopper } from "@popperjs/core"

export default class extends ApplicationController {
  static targets = ["submenu", "toggle", "toggleug"]

  connect() {
    super.connect()

    if (this.hasSubmenuTarget) {
      this.popperInstance = createPopper(this.element, this.submenuTarget, {
        placement:  "auto",
        strategy: "absolute",
        modifiers: [
          { name: "offset", options: { offset: [0, 0] } },
          {
            name: "flip",
            enabled: true,
            options: {
              fallbackPlacements: ["bottom", "right"],
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

      this.mutationObserver = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
          this.updateBoundary()
        });
      });
      this.mutationObserver.observe(this.popperInstance.state.elements.popper, {  childList: true, subtree: true, attributes: true });
    }

    if(this.hasToggleugTarget) {
      let groupByData = JSON.parse(this.toggleugTarget.dataset.show_params)
      if(this.toggleugTarget.id == "group_by_"+groupByData.current_view+"_"+groupByData.group_by_column) {
        this.toggleugTarget.classList.toggle("hidden")
      }
    }
  }

  disconnect() {
    super.disconnect()
    if (this.hasSubmenuTarget) {
      this.popperInstance.destroy()
    }
    this.mutationObserver.disconnect()
  }

  show(event) {
    if (this.hasSubmenuTarget && (!this.hasToggleTarget || (this.hasToggleTarget && this.toggledOn))) {
      this.submenuTarget.classList.remove("hidden")
      this.submenuTarget.setAttribute("data-show", "")
      this.popperInstance.update()

      const firstInputEle = this.popperInstance.state.elements.popper.querySelector('form input:not([class=hidden])')
      const length = firstInputEle?.value.length;
      firstInputEle?.setSelectionRange(length, length);
      firstInputEle?.focus()
    }
    event.stopPropagation()
  }

  hide(event) {
    if (this.hasSubmenuTarget) {
      this.submenuTarget.classList.add("hidden")
      this.submenuTarget.removeAttribute("data-show")

      const boundary = this.element.closest(".table-wrp")
      if (boundary){
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

    if (this.hasToggleugTarget) {
      let ungroupElements  = document.getElementsByClassName('ungroup-icon')
      Array.from(ungroupElements).forEach(function (element) {
        element.classList.add('hidden')
      });

      if ((event.currentTarget != this.toggleugTarget && this.toggleugTarget.classList.contains("hidden")) ||
          (event.currentTarget == this.toggleugTarget && !this.toggleugTarget.classList.contains("hidden")) ) {
        this.toggleugTarget.classList.toggle("hidden")
      }
    }
  }


  updateBoundary(){
    const boundary = this.element.closest(".table-wrp")
    if(!boundary) return

    const maxHeight = parseInt(window.getComputedStyle(boundary).maxHeight.replace("px", ""))
    const popperElement = this.popperInstance.state.elements.popper
    if (boundary.clientHeight < Math.min(boundary.scrollHeight, maxHeight)) {
      boundary.style.minHeight = `${Math.min(boundary.scrollHeight + 20, maxHeight)}px`;
      popperElement.update()
    }
  }


  get toggledOn() {
    return !this.toggleTarget.classList.contains("hidden")
  }
}
