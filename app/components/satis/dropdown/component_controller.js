import { Controller } from "stimulus"

// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"

export default class extends Controller {
  static targets = ["itemsContainer", "items", "item", "searchInput", "resetButton", "toggleButton", "hiddenInput"]
  static values = { url: String }

  connect() {
    this.debouncedFetchResults = debounce(this.fetchResults.bind(this), 250)
    this.selectedIndex = 0
    this.lastSearch = null

    // Put current selection in search field
    if (this.hiddenInputTarget.value) {
      if (this.itemTargets.length == 0) {
        const ourUrl = new URL(this.urlValue)
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
    this.debouncedFetchResults = nil
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
        const dataDiv = this.selectedItem

        this.hideResultsList()
        this.hiddenInputTarget.value = dataDiv.getAttribute("data-satis-dropdown-item-value")
        this.searchInputTarget.value = dataDiv.getAttribute("data-satis-dropdown-item-text")

        event.preventDefault()
        return false

        break
      case "Escape":
        if (!this.resultsHidden) {
          this.hideResultsList(event)
        } else {
          this.searchInputTarget.value = null
        }

        break
      default:
        break
    }

    return true
  }

  // User enters text in the search field
  search(event) {
    this.debouncedFetchResults()
  }

  // User presses reset button
  reset(event) {
    this.searchInputTarget.value = null
    this.hideResultsList()

    event.preventDefault()
    return false
  }

  // User selects an item using mouse
  select(event) {
    const dataDiv = event.target.closest('[data-satis-dropdown-target="item"]')

    this.hideResultsList()
    this.hiddenInputTarget.value = dataDiv.getAttribute("data-satis-dropdown-item-value")
    this.searchInputTarget.value = dataDiv.getAttribute("data-satis-dropdown-item-text")
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

  fetchResults(event) {
    if (this.searchInputTarget.value.length < 2 || this.searchInputTarget.value == this.lastSearch) {
      return
    }
    if (!this.hasUrlValue) {
      return
    }
    this.lastSearch = this.searchInputTarget.value
    const ourUrl = new URL(this.urlValue)
    ourUrl.searchParams.append("term", this.searchInputTarget.value)
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

  get resultsHidden() {
    this.itemsContainerTarget.classList.contains("hidden")
  }

  get nrOfItems() {
    return this.itemsTarget.children.length
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
    return this.itemsTarget.children[this.selectedIndex]
  }

  lowLightSelected() {
    this.selectedItem.classList.remove("bg-blue-200")
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
