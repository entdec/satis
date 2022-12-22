import ApplicationController from "../../../../frontend/controllers/application_controller"

// FIXME: Is this full path really needed?
import { debounce, popperSameWidth } from "../../../../frontend/utils"
import { createPopper } from "@popperjs/core"

export default class extends ApplicationController {
  static targets = ["results", "items", "item", "searchInput", "resetButton", "toggleButton", "hiddenInput"]
  static values = {
    chainTo: String,
    freeText: Boolean,
    needsExactMatch: Boolean,
    pageSize: Number,
    url: String,
    urlParams: Object,
  }

  connect() {
    super.connect()

    this.debouncedFetchResults = debounce(this.fetchResults.bind(this), 250)
    this.debouncedLocalResults = debounce(this.localResults.bind(this), 250)
    this.selectedIndex = -1

    this.boundClickedOutside = this.clickedOutside.bind(this)
    this.boundResetSearchInput = this.resetSearchInput.bind(this)
    this.boundHandleHiddenInputChange = this.handleHiddenInputChange.bind(this)
    this.boundBlur = this.handleBlur.bind(this)

    // To remember what the current page and last page were, we queried
    this.currentPage = 1
    this.lastPage = null
    this.endPage = null

    // To remember what the last search was we did
    this.lastSearch = null

    this.display()

    this.popperInstance = createPopper(this.element, this.resultsTarget, {
      offset: [-20, 2],
      placement: "bottom-start",
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
          enabled: true,
        },
        popperSameWidth,
      ],
    })

    this.searchInputTarget.addEventListener("blur", this.boundBlur)
    this.toggleButtonTarget.addEventListener("blur", this.boundBlur)
    this.resultsTarget.addEventListener("blur", this.boundBlur)

    window.addEventListener("click", this.boundClickedOutside)

    this.hiddenInputTarget.addEventListener("change", this.boundHandleHiddenInputChange)
  }

  disconnect() {
    this.debouncedFetchResults = null
    this.debouncedLocalResults = null
    window.removeEventListener("click", this.boundClickedOutside)
  }

  focus(event) {
    this.searchInputTarget.focus()
  }

  blur(event) {
    this.handleBlur(event)
  }

  handleBlur(event) {
    if (!this.element.contains(event.relatedTarget) && this.resultsShown) {
      this.hideResultsList()
      if (event.target == this.searchInputTarget) {
        this.boundResetSearchInput(event)
      }
    }
  }

  handleHiddenInputChange(event) {
    if (event?.detail?.src == "satis-dropdown") {
      return
    }

    if (this.hiddenInputTarget.value == "") {
      this.searchInputTarget.value = null
    } else {
      this.resetSearchInput()
    }
  }

  // Called on connect
  // FIXME: Has code duplication with select
  display(event) {
    // Ignore if we triggered this change event
    if (event?.detail?.src == "satis-dropdown") {
      return
    }

    // Put current selection in search field
    if (this.hiddenInputTarget.value) {
      if (this.itemTargets.length == 0) {
        let ourUrl = this.normalizedUrl
        ourUrl.searchParams.append("id", this.hiddenInputTarget.value)
        ourUrl.searchParams.append("page", this.currentPage)
        ourUrl.searchParams.append("page_size", this.pageSizeValue)

        this.fetchResultsWith(ourUrl).then(() => {
          this.setHiddenInput()
        })
      } else {
        this.setHiddenInput()
      }

      if (!this.searchInputTarget.value && this.freeTextValue) {
        this.searchInputTarget.value = this.hiddenInputTarget.value
      }
    }
  }

  // Called when scrolling in the resultsTarget
  scroll(event) {
    if (this.elementScrolled(this.resultsTarget)) {
      this.fetchResults(event)
    }
  }

  // User presses keys
  dispatch(event) {
    if (event.target.closest('[data-controller="satis-dropdown"]') != this.element) {
      return
    }

    this.filterResultsChainTo()

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
        event.preventDefault()
        this.select(event)

        break
      case "Escape":
        if (this.resultsShown) {
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
      this.debouncedFetchResults(event)
    } else {
      this.debouncedLocalResults(event)
    }

    if (this.searchInputTarget.value) {
      this.searchInputTarget.closest(".bg-white").classList.add("warning")
    } else {
      this.searchInputTarget.closest(".bg-white").classList.remove("warning")
    }
  }

  // User presses reset button
  reset(event) {
    this.hiddenInputTarget.value = null
    this.hiddenInputTarget.dispatchEvent(new Event("change"))
    this.searchInputTarget.value = null
    this.lastSearch = null
    this.lastPage = null
    this.endPage = null

    if (this.selectedItem) {
      this.selectedItem.classList.remove("bg-primary-200")
    }
    this.selectedIndex = -1
    if (this.hasUrlValue) {
      this.itemsTarget.innerHTML = ""
    }
    this.hideResultsList()
    this.itemTargets.forEach((item) => {
      item.classList.remove("hidden")
    })

    if (event) {
      event.preventDefault()
    }

    if (this.searchInputTarget.closest(".bg-white").classList.contains("warning")) {
      this.searchInputTarget.closest(".bg-white").classList.remove("warning")
    }

    return false
  }

  // User selects an item using mouse
  select(event) {
    let dataDiv = event.target.closest('[data-satis-dropdown-target="item"]')
    if (dataDiv == null) {
      dataDiv = this.selectedItem
    }

    if (dataDiv == null) {
      return
    }

    this.selectItem(dataDiv)

    event.preventDefault()
  }

  selectItem(dataDiv) {
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

    if (this.searchInputTarget.closest(".bg-white").classList.contains("warning")) {
      this.searchInputTarget.closest(".bg-white").classList.remove("warning")
    }
  }

  // --- Helpers

  setHiddenInput() {
    const currentItem = this.itemTargets.find((item) => {
      return this.hiddenInputTarget.value == item.getAttribute("data-satis-dropdown-item-value")
    })
    if (currentItem) {
      this.searchInputTarget.value = currentItem.getAttribute("data-satis-dropdown-item-text")

      Array.prototype.slice.call(currentItem.attributes).forEach((attr) => {
        if (
          attr.name.startsWith("data") &&
          !attr.name.startsWith("data-satis") &&
          !attr.name.startsWith("data-action")
        ) {
          this.hiddenInputTarget.setAttribute(attr.name, attr.value)
        }
      })
      if (!this.hiddenInputTarget.getAttribute("data-reflex")) {
        this.hiddenInputTarget.dispatchEvent(new CustomEvent("change", { detail: { src: "satis-dropdown" } }))
      }
    }
  }

  toggleResultsList(event) {
    if (this.resultsShown) {
      this.hideResultsList(event)

      // Not sure what the intent is, but this causes Safari not to open a ticket
      // } else if (this.element.contains(document.activeElement)) {
    } else {
      this.filterResultsChainTo()
      if (this.hasResults) {
        this.showResultsList(event)
      } else {
        this.fetchResults(event)
      }
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

  filterResultsChainTo() {
    if (!this.chainToValue) {
      return
    }

    let chainToValue
    let chainTo = this.hiddenInputTarget.form.querySelector(`[name="${this.chainToValue}"]`)
    if (chainTo) {
      chainToValue = chainTo.value
    }

    this.itemTargets.forEach((item) => {
      let itemChainToValue = item.getAttribute("data-chain")
      let chainMatch = true
      if (this.chainToValue || itemChainToValue) {
        chainMatch = chainToValue == itemChainToValue
      }

      if (chainMatch) {
        item.classList.remove("hidden")
      } else {
        item.classList.add("hidden")
      }
    })
  }

  localResults(event) {
    if (this.searchInputTarget.value == this.lastSearch) {
      return
    }

    if (this.searchInputTarget.value.length < 2) {
      return
    }

    this.lastSearch = this.searchInputTarget.value

    this.itemTargets.forEach((item) => {
      item.classList.remove("hidden")
    })

    this.filterResultsChainTo()

    let matches = []
    this.itemTargets.forEach((item) => {
      let text = item.getAttribute("data-satis-dropdown-item-text").toLowerCase()
      let value = item.getAttribute("data-satis-dropdown-item-value").toLowerCase()

      if (!item.classList.contains("hidden")) {
        if (this.needsExactMatchValue && text === this.searchInputTarget.value.toLowerCase()) {
          matches = matches.concat(item)
        } else if (!this.needsExactMatchValue && text.indexOf(this.searchInputTarget.value.toLowerCase()) >= 0) {
          matches = matches.concat(item)
        } else {
          item.classList.add("hidden")
        }
      }
    })

    if (this.freeTextValue && matches.length != 1) {
      this.hiddenInputTarget.value = this.lastSearch
    }

    if (
      matches.length == 1 &&
      matches[0].getAttribute("data-satis-dropdown-item-text").toLowerCase().indexOf(this.lastSearch.toLowerCase()) >= 0
    ) {
      this.selectItem(matches[0].closest('[data-satis-dropdown-target="item"]'))
    } else if (matches.length > 1) {
      this.showResultsList(event)
    }
  }

  // Remote search
  fetchResults(event) {
    const promise = new Promise((resolve, reject) => {
      if (
        (this.searchInputTarget.value == this.lastSearch &&
          (this.currentPage == this.lastPage || this.currentPage == this.endPage)) ||
        !this.hasUrlValue
      ) {
        return
      }

      if (this.searchInputTarget.value != this.lastSearch) {
        this.currentPage = 1
        this.endPage = null
      }

      this.lastSearch = this.searchInputTarget.value
      this.lastPage = this.currentPage

      let ourUrl = this.normalizedUrl
      let pageSize = this.pageSizeValue
      if (this.searchInputTarget.value.length >= 2) {
        ourUrl.searchParams.append("term", this.searchInputTarget.value)
      }
      ourUrl.searchParams.append("page", this.currentPage)
      ourUrl.searchParams.append("page_size", pageSize)
      if (this.needsExactMatchValue) {
        ourUrl.searchParams.append("needs_exact_match", this.needsExactMatchValue)
      }

      this.fetchResultsWith(ourUrl).then((itemCount) => {
        if (this.hasResults) {
          this.filterResultsChainTo()
          this.highLightSelected()
          this.showResultsList()

          if (
            this.nrOfItems == 1 &&
            this.itemTargets[0]
              .getAttribute("data-satis-dropdown-item-text")
              .toLowerCase()
              .indexOf(this.searchInputTarget.value.toLowerCase()) >= 0
          ) {
            this.selectItem(this.itemTargets[0].closest('[data-satis-dropdown-target="item"]'))
          } else if (this.nrOfItems == 1) {
            this.moveDown()
          }

          if (itemCount > 0) {
            this.currentPage += 1
          }
          if (itemCount < pageSize) {
            this.endPage = this.currentPage
          }

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

          if (this.currentPage == 1) {
            this.itemsTarget.innerHTML = tmpDiv.innerHTML
          } else {
            if (tmpDiv.innerHTML.length > 0) {
              this.itemsTarget.insertAdjacentHTML("beforeend", tmpDiv.innerHTML)
            }
          }

          resolve(tmpDiv.children.length)
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

    // Add searchParams based on url_params
    const form = this.element.closest("form")
    Object.entries(this.urlParamsValue).forEach((item) => {
      let elm = form.querySelector(`[name='${item[1]}']`)
      if (elm) {
        ourUrl.searchParams.append(item[0], elm.value)
      } else {
        ourUrl.searchParams.append(item[0], item[1])
      }
    })

    return ourUrl
  }

  get resultsShown() {
    return this.resultsTarget.hasAttribute("data-show")
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
      this.selectedItem.classList.remove("bg-primary-200")
    }
  }

  highLightSelected() {
    if (this.selectedItem) {
      this.selectedItem.classList.add("bg-primary-200")
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

  resetSearchInput(event) {
    this.setHiddenInput()
  }

  clickedOutside(event) {
    if (event.target.tagName == "svg" || event.target.tagName == "path") {
      return
    }
    if (!this.element.contains(event.target)) {
      if (this.resultsShown) {
        this.hideResultsList()
      }
    }
  }
}
