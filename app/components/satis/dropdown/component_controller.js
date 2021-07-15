import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

export default class extends ApplicationController {
  static targets = ["itemsContainer", "items", "item", "searchInput", "resetButton", "toggleButton", "hiddenInput"]
  static values = { url: String, urlParams: Object }

  connect() {
    this.debouncedFetchResults = debounce(this.fetchResults.bind(this), 250)
    this.debouncedLocalResults = debounce(this.localResults.bind(this), 250)
    this.selectedIndex = -1
    this.lastSearch = null

    // Put current selection in search field
    if (this.hiddenInputTarget.value) {
      if (this.itemTargets.length == 0) {
        let ourUrl = this.normalizedUrl
        ourUrl.searchParams.append("id", this.hiddenInputTarget.value)

        this.fetchResultsWith(ourUrl).then(() => {
          const currentItem = this.itemTargets.find((item) => {
            return this.hiddenInputTarget.value == item.getAttribute("data-satis-dropdown-item-value")
          })
          this.searchInputTarget.value = currentItem.getAttribute("data-satis-dropdown-item-text")
        })
      } else {
        const currentItem = this.itemTargets.find((item) => {
          return this.hiddenInputTarget.value == item.getAttribute("data-satis-dropdown-item-value")
        })
        this.searchInputTarget.value = currentItem.getAttribute("data-satis-dropdown-item-text")
      }
    }
  }

  disconnect() {
    this.debouncedFetchResults = null
    this.debouncedLocalResults = null
  }

  // User presses keys
  dispatch(event) {
    if (event.target.closest('[data-controller="satis-dropdown"]') != this.element) {
      return
    }

    switch (event.key) {
      case "ArrowDown":
        if (this.hasResults) {
          this.showResultsList(event)

          this.moveDown()
        }
        break
      case "ArrowUp":
        if (this.hasResults) {
          this.moveUp()
        }
        break
      case "Enter":
        this.select(event)

        break
      case "Escape":
        if (!this.resultsHidden) {
          this.hideResultsList(event)
        } else {
          this.reset(event)
        }

        break
      default:
        break
    }

    return true
  }

  // User enters text in the search field
  search(event) {
    if (this.hasUrlValue) {
      this.debouncedFetchResults()
    } else {
      this.debouncedLocalResults()
    }
  }

  // User presses reset button
  reset(event) {
    this.hiddenInputTarget.value = null
    this.searchInputTarget.value = null
    if (this.selectedItem) {
      this.selectedItem.classList.remove("bg-blue-200")
    }
    this.selectedIndex = -1
    this.hideResultsList()
    this.itemTargets.forEach((item) => {
      item.classList.remove("hidden")
    })

    event.preventDefault()
    return false
  }

  // User selects an item using mouse
  select(event) {
    let dataDiv = event.target.closest('[data-satis-dropdown-target="item"]')
    if (dataDiv == null) {
      dataDiv = this.selectedItem
    }

    this.hideResultsList()

    Array.prototype.slice.call(dataDiv.attributes).forEach((attr) => {
      if (attr.name.startsWith("data") && !attr.name.startsWith("data-satis") && !attr.name.startsWith("data-action")) {
        this.hiddenInputTarget.setAttribute(attr.name, attr.value)
      }
    })

    this.searchInputTarget.value = dataDiv.getAttribute("data-satis-dropdown-item-text")
    this.hiddenInputTarget.value = dataDiv.getAttribute("data-satis-dropdown-item-value")
    this.lastSearch = this.searchInputTarget.value

    this.hiddenInputTarget.dispatchEvent(new Event("change"))

    event.preventDefault()
  }

  // --- Helpers

  toggleResultsList(event) {
    if (this.itemsContainerTarget.classList.contains("hidden")) {
      this.showResultsList(event)
    } else {
      this.hideResultsList(event)
    }

    event.preventDefault()
    return false
  }

  showResultsList(event) {
    this.itemsContainerTarget.classList.remove("hidden")
    this.toggleButtonTarget.querySelector(".feather-chevron-up").classList.remove("hidden")
    this.toggleButtonTarget.querySelector(".feather-chevron-down").classList.add("hidden")
  }

  hideResultsList(event) {
    this.itemsContainerTarget.classList.add("hidden")
    this.toggleButtonTarget.querySelector(".feather-chevron-up").classList.add("hidden")
    this.toggleButtonTarget.querySelector(".feather-chevron-down").classList.remove("hidden")
  }

  localResults(event) {
    if (this.searchInputTarget.value.length < 2 || this.searchInputTarget.value == this.lastSearch) {
      return
    }

    this.lastSearch = this.searchInputTarget.value

    this.itemTargets.forEach((item) => {
      item.classList.remove("hidden")
    })

    let matches = []
    this.itemTargets.forEach((item) => {
      let text = item.getAttribute("data-satis-dropdown-item-text").toLowerCase()
      let value = item.getAttribute("data-satis-dropdown-item-value").toLowerCase()

      if (text.indexOf(this.searchInputTarget.value.toLowerCase()) >= 0 || text.indexOf(this.searchInputTarget.value.toLowerCase()) >= 0) {
        matches = matches.concat(item)
      } else {
        item.classList.add("hidden")
      }
    })
    if (matches.length > 0) {
      this.showResultsList(event)
    }
  }

  // Remote search
  fetchResults(event) {
    if (this.searchInputTarget.value.length < 2 || this.searchInputTarget.value == this.lastSearch) {
      return
    }
    if (!this.hasUrlValue) {
      return
    }
    this.lastSearch = this.searchInputTarget.value
    let ourUrl = this.normalizedUrl
    ourUrl.searchParams.append("term", this.searchInputTarget.value)

    // Add searchParams based on url_params
    const form = this.element.closest("form")
    Object.entries(this.urlParamsValue).forEach((item) => {
      let elm = form.querySelector(`[name='${item[1]}']`)
      if (elm) {
        ourUrl.searchParams.append(item[0], elm.value)
      }
    })

    this.fetchResultsWith(ourUrl).then(() => {
      if (this.hasResults) {
        this.highLightSelected()
        this.itemsContainerTarget.classList.remove("hidden")
      }
    })
  }

  fetchResultsWith(ourUrl) {
    const promise = new Promise((resolve, reject) => {
      fetch(ourUrl.href, {}).then((response) => {
        response.text().then((data) => {
          let tmpDiv = document.createElement("div")
          tmpDiv.innerHTML = data

          // Add needed items
          Array.from(tmpDiv.children).forEach((item) => {
            item.setAttribute("data-satis-dropdown-target", "item")
            item.setAttribute("data-action", "click->satis-dropdown#select")
          })

          this.itemsTarget.innerHTML = tmpDiv.innerHTML

          resolve()
        })
      })
    })
    return promise
  }

  get normalizedUrl() {
    let ourUrl
    try {
      ourUrl = new URL(this.urlValue)
    } catch (error) {
      ourUrl = new URL(this.urlValue, window.location.href)
    }
    return ourUrl
  }

  get resultsHidden() {
    return this.itemsContainerTarget.classList.contains("hidden")
  }

  get nrOfItems() {
    return this.itemTargets.filter((item) => {
      return !item.classList.contains("hidden")
    }).length
  }

  get hasResults() {
    return this.nrOfItems > 0
  }

  increaseSelectedIndex() {
    this.selectedIndex = this.selectedIndex + 1
    if (this.selectedIndex >= this.nrOfItems) {
      this.selectedIndex = this.nrOfItems - 1
    }
  }

  decreaseSelectedIndex() {
    this.selectedIndex = this.selectedIndex - 1
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0
    }
  }

  get selectedItem() {
    return this.itemTargets.filter((item) => {
      return !item.classList.contains("hidden")
    })[this.selectedIndex]
  }

  lowLightSelected() {
    if (this.selectedItem) {
      this.selectedItem.classList.remove("bg-blue-200")
    }
  }

  highLightSelected() {
    if (this.selectedItem) {
      this.selectedItem.classList.add("bg-blue-200")
      this.selectedItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    }
  }

  moveDown() {
    this.lowLightSelected()
    this.increaseSelectedIndex()
    this.highLightSelected()
  }

  moveUp() {
    this.lowLightSelected()
    this.decreaseSelectedIndex()
    this.highLightSelected()
  }
}
