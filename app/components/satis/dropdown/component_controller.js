import ApplicationController from "../../../../frontend/controllers/application_controller"
// FIXME: Is this full path really needed?
import { debounce } from "../../../../frontend/utils"
import { createPopper } from "@popperjs/core"

export default class extends ApplicationController {
  static targets = ["results", "items", "item", "searchInput", "resetButton", "toggleButton", "hiddenInput"]
  static values = {
    url: String,
    urlParams: Object,
    pageSize: Number,
  }

  connect() {
    this.debouncedFetchResults = debounce(this.fetchResults.bind(this), 250)
    this.debouncedLocalResults = debounce(this.localResults.bind(this), 250)
    this.selectedIndex = -1

    // To remember what the current page and last page were, we queried
    this.currentPage = 0
    this.lastPage = null

    // To remember what the last search was we did
    this.lastSearch = null

    this.popperInstance = createPopper(this.element, this.resultsTarget, {
      offset: [-20, 2],
      placement: "bottom",
      modifiers: [
        {
          name: "flip",
          enabled: true,
          options: {
            boundary: this.element.closest(".satis-card"),
          },
        },
        {
          name: "preventOverflow",
        },
      ],
    })

    this.display()
  }

  disconnect() {
    this.debouncedFetchResults = null
    this.debouncedLocalResults = null
  }

  // Called on connect
  display(event) {
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

  // Called when scrolling in the resultsTarget
  scroll(event) {
    if (this.elementScrolled(this.resultsTarget)) {
      // FIXME: One problem with this is that you could possibly go beyond the max nr of pages
      this.currentPage += 1
      this.fetchResults(event)
    }
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
    this.hiddenInputTarget.dispatchEvent(new Event("change"))
    this.searchInputTarget.value = null
    this.lastSearch = null
    this.lastPage = null
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

    // Copy over data attributes on the item div to the hidden input
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
    if (this.resultsHidden) {
      if (this.hasResults) {
        this.showResultsList(event)
      } else {
        this.fetchResults(event)
      }
    } else {
      this.hideResultsList(event)
    }

    event.preventDefault()
    return false
  }

  showResultsList(event) {
    this.resultsTarget.classList.remove("hidden")
    this.resultsTarget.setAttribute("data-show", "")
    this.popperInstance.update()
    this.toggleButtonTarget.querySelector(".fa-chevron-up").classList.remove("hidden")
    this.toggleButtonTarget.querySelector(".fa-chevron-down").classList.add("hidden")
  }

  hideResultsList(event) {
    this.resultsTarget.classList.add("hidden")
    this.resultsTarget.removeAttribute("data-show")
    this.toggleButtonTarget.querySelector(".fa-chevron-up").classList.add("hidden")
    this.toggleButtonTarget.querySelector(".fa-chevron-down").classList.remove("hidden")
  }

  localResults(event) {
    if (this.searchInputTarget.value == this.lastSearch) {
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
    const promise = new Promise((resolve, reject) => {
      if (this.searchInputTarget.value == this.lastSearch && this.currentPage == this.lastPage) {
        return
      }
      if (this.searchInputTarget.value != this.lastSearch) {
        this.currentPage = 0
      }
      if (!this.hasUrlValue) {
        return
      }

      this.lastSearch = this.searchInputTarget.value
      this.lastPage = this.currentPage

      let ourUrl = this.normalizedUrl
      if (this.searchInputTarget.value.length >= 2) {
        ourUrl.searchParams.append("term", this.searchInputTarget.value)
      }
      ourUrl.searchParams.append("page", this.currentPage)
      ourUrl.searchParams.append("page_size", this.pageSizeValue)

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
          this.showResultsList()
          resolve()
        }
      })
    })
    return promise
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

          if (this.currentPage == 0) {
            this.itemsTarget.innerHTML = tmpDiv.innerHTML
          } else {
            if (tmpDiv.innerHTML.length > 0) {
              this.itemsTarget.insertAdjacentHTML("beforeend", tmpDiv.innerHTML)
            }
          }

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
    return !this.resultsTarget.hasAttribute("data-show")
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
