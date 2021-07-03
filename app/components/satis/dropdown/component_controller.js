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
    this.selectedItem.classList.add("bg-blue-200")
    this.selectedItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
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

  key_press(event) {
    console.log("keyDown", event)
    switch (event.key) {
      case "ArrowDown":
        if (this.hasResults) {
          this.moveDown()
        }
        break
      case "ArrowUp":
        if (this.hasResults) {
          this.moveUp()
        }
        break
      case "Enter":
        // this.searchInputTarget.value = '';
        break
      case "Escape":
        this.itemsContainerTarget.classList.add("hidden")

        break
      default:
        break
    }
    return true
  }

  search(event) {
    this.debouncedFetchResults()
  }

  reset(event) {
    this.searchInputTarget.value = null
    this.itemsContainerTarget.classList.add("hidden")

    event.preventDefault()
    return false
  }

  select(event) {
    const dataDiv = event.target.closest('[data-satis-dropdown-target="item"]')

    this.itemsContainerTarget.classList.add("hidden")
    this.hiddenInputTarget.value = dataDiv.getAttribute("data-satis-dropdown-item-value")
    this.searchInputTarget.value = dataDiv.getAttribute("data-satis-dropdown-item-text")
  }

  toggleMenu(event) {
    this.itemsContainerTarget.classList.toggle("hidden")
    this.toggleButtonTarget.querySelector(".feather-chevron-up").classList.toggle("hidden")
    this.toggleButtonTarget.querySelector(".feather-chevron-down").classList.toggle("hidden")

    event.preventDefault()
    return false
  }

  fetchResults(event) {
    if (this.searchInputTarget.value.length < 2 || this.searchInputTarget.value == this.lastSearch) {
      return
    }
    this.lastSearch = this.searchInputTarget.value
    const ourUrl = new URL(this.urlValue)
    ourUrl.searchParams.append("term", this.searchInputTarget.value)
    fetchResultsWith(ourUrl).then(() => {
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
}
