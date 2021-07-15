import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

import Sortable from "sortablejs"

export default class extends ApplicationController {
  static targets = ["header", "column"]

  connect() {
    new Sortable(this.headerTarget, {
      swapThreshold: 1,
      animation: 150,
      onStart: (event) => {
        this.element.classList.add("dragging")
        return true
      },
      onEnd: (event) => {
        this.element.classList.remove("dragging")
        this.columnDragged(event)
      },
    })
  }

  sort(event) {
    let columnName = event.target.closest("th").getAttribute("data-column")

    let turboFrame = this.element.closest("turbo-frame")
    let ourUrl = new URL(turboFrame.src, window.location.href)

    ourUrl.searchParams.set("order_field_name", columnName)
    let sorting = ourUrl.searchParams.get("order_direction")
    if (sorting == "asc") {
      ourUrl.searchParams.set("order_direction", "desc")
    } else {
      ourUrl.searchParams.set("order_direction", "asc")
    }

    turboFrame.src = ourUrl
    return true
  }

  columnDragged(event) {
    let order = this.columnTargets.map((element) => {
      return element.getAttribute("data-column")
    })

    // FIXME: Make this a target, by moving up the controller, outside the frame?
    let turboFrame = this.element.closest("turbo-frame")
    let ourUrl = new URL(turboFrame.src, window.location.href)
    ourUrl.searchParams.set("column_order", order)
    turboFrame.src = ourUrl
    return true
  }
}
