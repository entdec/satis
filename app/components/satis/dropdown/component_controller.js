import { Controller } from "stimulus"

const debounce = (func, wait = 500) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

// Based on: https://tailwindcomponents.com/component/select-with-custom-list
//
// Missing:
// - allow selection of items
// - selection should be stored in select or hidden input
// - ton of other things
export default class extends Controller {
  static targets = ["itemsContainer", "items", "item", "searchInput", "resetButton", "toggleButton"]
  static values = { url: String }

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

  connect() {
    this.debouncedFetchResults = debounce(this.fetchResults.bind(this), 250)
    this.selectedIndex = 0
    this.lastSearch = null
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
      default:
        break
    }
    return true
  }

  search(event) {
    this.debouncedFetchResults()
  }

  toggleMenu() {
    this.toggleButtonTarget.classList.toggle("transform")
    this.toggleButtonTarget.classList.toggle("rotate-180")
    this.itemsContainerTarget.classList.toggle("hidden")
  }

  fetchResults(event) {
    if (this.searchInputTarget.value.length < 2 || this.searchInputTarget.value == this.lastSearch) {
      return
    }
    this.lastSearch = this.searchInputTarget.value
    const ourUrl = new URL(this.urlValue)
    ourUrl.searchParams.append("term", this.searchInputTarget.value)
    fetch(ourUrl.href, {}).then((response) => {
      response.text().then((data) => {
        this.itemsTarget.innerHTML = data

        console.log("this.itemTargets", this.itemTargets)

        if (this.hasResults) {
          this.highLightSelected()
          this.itemsContainerTarget.classList.remove("hidden")
        }
      })
    })
  }
}
