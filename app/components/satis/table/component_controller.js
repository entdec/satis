import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

import Sortable from "sortablejs"

export default class extends ApplicationController {
  static targets = ["header", "hiddenHeader", "column", "filterRow", "filter", "filterIndicator", "overlay", "modal"]
  static values = {
    currentPage: Number,
    resetUrl: String,
    totalPages: Number,
  }

  static keyBindings = [
    {
      keys: ["h", "left", "pageup"],
      handler: (event, combo, controller) => {
        controller.prevPage(event)
      },
    },
    {
      keys: ["l", "right", "pagedown"],
      handler: (event, combo, controller) => {
        controller.nextPage(event)
      },
    },
    {
      keys: ["e"],
      handler: (event, combo, controller) => {
        controller.export(event)
      },
    },
    {
      keys: ["mod+k"],
      handler: (event, combo, controller) => {
        controller.openSearch(event)
      },
    },
    {
      keys: ["esc"],
      handler: (event, combo, controller) => {
        controller.reset(event)
      },
    },
  ]

  connect() {
    super.connect()

    let turboFrame = this.element.closest("turbo-frame")
    if (turboFrame) {
      this.resetUrlValue = turboFrame.getAttribute("data-satis-table-reset-url")
    }

    this.searchOpen = false
    this.boundSearchKeydown = this.searchKeydown.bind(this)

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
  }

  // Show and hide the filters header when you enter or leave the columns header
  toggleFilters(event) {
    if (this.filterRowTarget.classList.contains("hidden")) {
      this.filterRowTarget.classList.remove("hidden")
    } else {
      this.filterRowTarget.classList.add("hidden")
    }

    let indicator = event.target.closest('[data-satis-table-target="filterIndicator"]')
    let filter = indicator.getAttribute("data-filter")
    let column = indicator.getAttribute("data-column")

    let input = this.filterRowTarget.querySelector(`[name="tables_controller_filters[${filter}]"]`)
    if (input) {
      input.closest('table').querySelector(`th[data-column="${column}"]`).scrollIntoView()
      input.focus()
      input.dispatchEvent(new Event("focus"))
    }

    event.cancelBubble = true
  }

  //
  filter(event) {
    // Ignore if satis-dropdown triggered this change event because of the display
    if (event?.detail?.src == "satis-dropdown") {
      return
    }

    let turboFrame = this.element.closest("turbo-frame")
    let ourUrl = new URL(turboFrame.src, window.location.href)

    this.filterTargets.forEach((element) => {
      let paramName = element.name.match(/\[(.*)\]/)[1]
      if (element.value.length > 0) {
        ourUrl.searchParams.set(paramName, element.value)
      } else {
        ourUrl.searchParams.delete(paramName)
      }
    })

    this.filterIndicatorTargets.forEach((element) => {
      let paramName = element.getAttribute("data-column")
      if (ourUrl.searchParams.get(paramName)) {
        element.classList.add("text-primary-600")
        let icon = element.querySelector(".fa-filter")
        if (icon) {
          icon.classList.remove("fa-light")
          icon.classList.add("fa-solid")
        }
      }
    })

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

  prevPage() {
    if (this.currentPageValue > 1) {
      let turboFrame = this.element.closest("turbo-frame")
      if (turboFrame) {
        let ourUrl = new URL(turboFrame.src, window.location.href)
        ourUrl.searchParams.set("page", this.currentPageValue - 1)
        turboFrame.src = ourUrl
      }
    }
  }

  nextPage() {
    if (this.currentPageValue < this.totalPagesValue) {
      let turboFrame = this.element.closest("turbo-frame")
      if (turboFrame) {
        let ourUrl = new URL(turboFrame.src, window.location.href)
        ourUrl.searchParams.set("page", this.currentPageValue + 1)
        turboFrame.src = ourUrl
      }
    }
  }

  export(event) {
    let turboFrame = this.element.closest("turbo-frame")

    let ourUrl = new URL(turboFrame.src, window.location.href)
    let exportUrl = new URL(`/action_table/${encodeURIComponent(turboFrame.id)}/export.xlsx`, window.location.href)
    exportUrl.search = ourUrl.search
    window.location.replace(exportUrl)
  }

  openSearch(event) {
    this.searchOpen = true
    this.overlayTarget.classList.remove("hidden")
    this.overlayTarget.classList.remove("ease-in", "duration-200", "opacity-0")
    this.overlayTarget.classList.add("ease-out", "duration-300", "opacity-100")
    let input = this.modalTarget.querySelector("input")
    // Yup this solves the not focussing in Safari.
    setTimeout(() => {
      input.focus()
    }, 0)
    input.addEventListener("keydown", this.boundSearchKeydown)
  }

  closeSearch(event) {
    let input = this.modalTarget.querySelector("input")
    input.blur()
    input.removeEventListener("keydown", this.boundSearchKeydown)
    this.searchOpen = false
    this.overlayTarget.classList.remove("ease-out", "duration-300", "opacity-100")
    this.overlayTarget.classList.add("ease-in", "duration-200", "opacity-0")
    this.overlayTarget.classList.add("hidden")
  }

  reset(event) {
    if (this.searchOpen) {
      this.closeSearch(event)
    } else {
      let turboFrame = this.element.closest("turbo-frame")
      if (turboFrame && this.hasResetUrlValue) {
        let ourUrl = new URL(this.resetUrlValue, window.location.href)
        turboFrame.src = ourUrl
      }
    }
  }

  searchKeydown(event) {
    if (event.key == "Escape") {
      this.closeSearch(event)
    } else if (event.key == "Enter") {
      let turboFrame = this.element.closest("turbo-frame")
      if (turboFrame) {
        let ourUrl = new URL(turboFrame.src, window.location.href)
        ourUrl.searchParams.set("query", event.target.value)
        turboFrame.src = ourUrl
      }
      this.closeSearch()
    }
  }
}
