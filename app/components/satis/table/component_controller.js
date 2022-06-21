import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

import Sortable from "sortablejs"

export default class extends ApplicationController {
  static targets = ["header", "hiddenHeader", "column", "filterRow", "filter", "filterIndicator", "overlay", "modal", "filter", "searchIcon", "search", "menu", "selectionColumn"]
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
      keys: ["esc"],
      handler: (event, combo, controller) => {
        controller.reset(event)
      },
    },
  ]

  connect() {
    super.connect()

    this.boundToggleListener = this._toggleListener.bind(this)
    this.element.addEventListener("toggle", this.boundToggleListener)

    if (this.filterTarget.value.length > 0) {
      this.filterTarget.focus()
    }

    let turboFrame = this.element.closest("turbo-frame")
    if (turboFrame) {
      this.resetUrlValue = turboFrame.getAttribute("data-satis-table-reset-url")
    }

    this.boundFilterKeydown = this.filterKeydown.bind(this)

    this.selectedRows = []

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
      input.closest("table").querySelector(`th[data-column="${column}"]`).scrollIntoView()
      input.focus()
      input.dispatchEvent(new Event("focus"))
    }

    event.cancelBubble = true
  }

  focusSearch(event) {
    this.searchTarget.focus()
  }

  selectRow(event) {
    let id = event.target.getAttribute("value")
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter((element) => element != id)
    } else {
      this.selectedRows.push(id)
    }

    event.cancelBubble = true
    event.stopPropagation()
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

    ourUrl.searchParams.set("page", "1")
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

  filterKeydown(event) {
    if (event.key == "Escape") {
      let turboFrame = this.element.closest("turbo-frame")
      if (turboFrame && this.hasResetUrlValue) {
        let ourUrl = new URL(this.resetUrlValue, window.location.href)
        turboFrame.src = ourUrl
      }
    } else if (event.key == "Enter") {
      let turboFrame = this.element.closest("turbo-frame")
      if (turboFrame) {
        let ourUrl = new URL(turboFrame.src, window.location.href)
        ourUrl.searchParams.set("query", event.target.value)
        ourUrl.searchParams.set("page", "1")
        turboFrame.src = ourUrl
      }
    }
  }

  _toggleListener(event) {
    this.selectionColumnTargets.forEach((element) => {
      if (event.detail.toggled) {
        element.classList.remove("hidden")
      } else {
        element.classList.add("hidden")
      }
    })
  }

  multi_select(event) {
    let aElement = event.target.closest("a")

    let url = new URL(aElement.href, window.location.href)
    let csrfToken = document.querySelector("meta[name=csrf-token]").content

    let response = fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json, text/javascript",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        action: aElement.id,
        selectedIds: this.selectedRows,
      }),
    }).then((response) => {
      if (response.ok) {
      } else if (!response.ok) {
      }
    })
    event.preventDefault()
  }
}
