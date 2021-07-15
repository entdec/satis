import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

import Sortable from "sortablejs"

export default class extends ApplicationController {
  static targets = ["header", "column"]

  connect() {
    console.log("table!")
    new Sortable(this.headerTarget, {
      swapThreshold: 1,
      animation: 150,
      onChoose: function (event) {
        console.log("choose")
      },
      onStart: function (event) {
        this.element.classList.add("dragging")
        return true
      },
      onEnd: (event) => {
        this.element.classList.remove("dragging")
        this.columnDragged(event)
      },
    })
  }

  columnDragged(event) {
    let order = this.columnTargets.map((element) => {
      return element.getAttribute("data-column")
    })
    let turboFrame = this.element.closest("turbo-frame")
    turboFrame.src = `/satis/tables/orders?column_order=${order}`
    return true
  }
}
