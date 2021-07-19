import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"
import { createPopper } from "@popperjs/core"

export default class extends ApplicationController {
  connect() {
    super.connect()

    this.element.querySelectorAll(".dropdown").forEach((dropdown, index) => {
      const dropdownMenu = dropdown.querySelector(".dropdown-menu")
      let popperInstance = null

      function create() {
        popperInstance = createPopper(dropdown, dropdownMenu, {
          placement: index == 0 ? "bottom-start" : "left-end",
        })
      }
      function destroy() {
        if (popperInstance) {
          popperInstance.destroy()
          popperInstance = null
        }
      }

      function show() {
        dropdownMenu.setAttribute("data-show", "")
        create()
      }

      function hide() {
        dropdownMenu.removeAttribute("data-show")
        destroy()
      }

      dropdown.addEventListener("mouseenter", show)
      dropdown.addEventListener("focus", show)
      dropdown.addEventListener("mouseleave", hide)
      dropdown.addEventListener("blur", hide)
    })
  }
}
