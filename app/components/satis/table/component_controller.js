import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

import Sortable from "sortablejs"

export default class extends ApplicationController {
  static targets = ["header", "hiddenHeader", "column", "filterRow", "filter"]

  connect() {
    new Sortable(this.hiddenHeaderTarget, {
      group: "columns",
    })
    new Sortable(this.headerTarget, {
      group: "columns",
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

    this.debouncedShowHideFilters = debounce(() => {
      if (this.mouseIn) {
        this.filterRowTarget.classList.remove("hidden")
      } else {
        this.filterRowTarget.classList.add("hidden")
      }
    }, 500)
  }

  // Show and hide the filters header when you enter or leave the columns header
  showFilters(event) {
    this.mouseIn = true
    this.debouncedShowHideFilters()
  }

  hideFilters(event) {
    this.mouseIn = false
    this.debouncedShowHideFilters()
  }

  //
  filter(event) {
    console.log("filter")
    let turboFrame = this.element.closest("turbo-frame")
    let ourUrl = new URL(turboFrame.src, window.location.href)

    this.filterTargets.forEach((element) => {
      if (element.value.length > 0) {
        let paramName = element.name.match(/\[(.*)\]/)[1]
        ourUrl.searchParams.set(paramName, element.value)
      }
    })

    console.log("ourUrl", ourUrl)

    turboFrame.src = ourUrl
    return true
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
    let order = Array.prototype.slice.call(this.headerTarget.querySelectorAll("th")).map((element) => {
      return element.getAttribute("data-column")
    })

    // FIXME: Make this a target, by moving up the controller, outside the frame?
    let turboFrame = this.element.closest("turbo-frame")
    if (turboFrame) {
      let ourUrl = new URL(turboFrame.src, window.location.href)
      ourUrl.searchParams.set("column_order", order)
      turboFrame.src = ourUrl
    }
    return true
  }

  refreshTable() {}
}
