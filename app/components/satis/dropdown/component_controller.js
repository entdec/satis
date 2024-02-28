import ApplicationController from "satis/controllers/application_controller"

import { debounce, popperSameWidth } from "utils"
import { createPopper } from "@popperjs/core"

export default class DropdownComponentController extends ApplicationController {

  static targets = [
    "results",
    "items",
    "item",
    "searchInput",
    "resetButton",
    "toggleButton",
    "hiddenSelect",
    "pills",
    "pillTemplate",
    "pill",
    "selectedItemsTemplate"
  ]

  static values = {
    chainTo: String,
    freeText: Boolean,
    needsExactMatch: Boolean,
    pageSize: Number,
    url: String,
    urlParams: Object,
    isMultiple: Boolean
  }

  connect() {
    super.connect()
    this.debouncedFetchResults = debounce(this.fetchResults.bind(this), 250)
    this.debouncedLocalResults = debounce(this.localResults.bind(this), 250)
    this.selectedIndex = -1

    this.boundClickedOutside = this.clickedOutside.bind(this)
    this.boundResetSearchInput = this.resetSearchInput.bind(this)
    this.boundBlur = this.blur.bind(this)
    this.boundChainToChanged = this.chainToChanged.bind(this)

    // To remember what the current page and last page were, we queried
    this.currentPage = 1
    this.lastPage = null
    this.endPage = null

    // To remember what the last search was we did
    this.searchQueryValue = null
    this.lastSearch = null
    this.minSearchQueryLength = 2

    // To remember what the last options were we got from the server to prevent unnecessary refreshes
    // and unexpected events
    this.lastServerRefreshOptions = new Set()

    this.popperInstance = createPopper(this.element, this.resultsTarget, {
      placement: "bottom-start",
      strategy: "fixed",
      modifiers: [
        { name: "offset", options: { offset: [0, 1] } },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["bottom"],
            boundary: this.element.closest(".sts-card"),
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: this.element.closest(".sts-card"),
          },
        },
        popperSameWidth,
      ],
    })
    this.popperInstance.state.elements.popper.popperInstance = () => this.popperInstance

    if (this.hasToggleButtonTarget) this.toggleButtonTarget.addEventListener("blur", this.boundBlur)
    this.searchInputTarget.addEventListener("blur", this.boundBlur)
    this.resultsTarget.addEventListener("blur", this.boundBlur)

    window.addEventListener("click", this.boundClickedOutside)

    setTimeout(() => {
      this.getScrollParent(this.element)?.addEventListener("scroll", this.boundBlur)
    }, 500)

    if (this.chainToValue) {
      this.getChainToElement()?.addEventListener("change", this.boundChainToChanged)
    }

    if (this.hiddenSelectTarget.selectedOptions.length > 0 && this.hiddenSelectTarget.selectedOptions[0].value) {
      this.refreshSelectionFromServer().then((changed) => {
        this.filterResultsChainTo()
        this.setHiddenSelect()

        if (!this.hiddenSelectTarget.getAttribute("data-reflex")) {
          let event = new Event("change")
          event.detail = { src: "satis-dropdown" }
          this.hiddenSelectTarget.dispatchEvent(event)
        }
      })
    }
  }

  getScrollParent(node) {
    if (node == null) {
      return null
    }

    let isScrollable = false

    if (node instanceof Element) {
      const vScrollValue = window.getComputedStyle(node).getPropertyValue("overflow-y")

      isScrollable = vScrollValue == "auto" || vScrollValue == "scroll"
    }

    if (isScrollable) {
      return node
    } else {
      return node.parentNode == null ? node : this.getScrollParent(node.parentNode)
    }
  }

  chainToChanged(event) {
    // Ignore if we triggered this change event
    if (event?.detail?.src == "satis-dropdown") {
      return
    }

    this.reset(event)
  }

  disconnect() {
    this.debouncedFetchResults = null
    this.debouncedLocalResults = null
    window.removeEventListener("click", this.boundClickedOutside)
    this.getChainToElement()?.removeEventListener("change", this.boundChainToChanged)
    if (this.hasToggleButtonTarget) this.toggleButtonTarget.removeEventListener("blur", this.boundBlur)
    this.resultsTarget.removeEventListener("blur", this.boundBlur)
    this.searchInputTarget.removeEventListener("blur", this.boundBlur)
  }

  focus(event) {
    this.searchInputTarget.focus()
  }

  blur(event) {
    let target = event.relatedTarget
    if (target == null) {
      target = document.target
    }

    if (event.type != "scroll" && !this.element.contains(target)) {
      if (this.resultsShown)
        this.hideResultsList()
      this.boundResetSearchInput(event)
    }
  }

  // Called on connect
  // FIXME: Has code duplication with select
  display(event) {
    // Ignore if we triggered this change event
    if (event?.detail?.src == "satis-dropdown") {
      return
    }

    this.refreshSelectionFromServer().then(() => {
      // resolved
      this.setHiddenSelect()

      if (!this.searchInputTarget.value && this.freeTextValue && this.hiddenSelectTarget.options.length > 0) {
        this.searchInputTarget.value = this.hiddenSelectTarget.options[0].value
      }

      if (!this.hiddenSelectTarget.getAttribute("data-reflex"))
        this.hiddenSelectTarget.dispatchEvent(new CustomEvent("change", { detail: { src: "satis-dropdown" } }))

      this.validateSearchQuery()
    })
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

    switch (event.key) {
      case "ArrowDown":
        if (this.hasResults) {
          if (!this.resultsShown)
            this.showResultsList(event)
          this.moveDown()
        }
        // prevent the cursor from jumping to the beginning of the input and scrolling in some cases
        event.preventDefault()
        break
      case "ArrowUp":
        if (this.hasResults) {
          this.moveUp()
        }
        // prevent the cursor from jumping to the beginning of the input and scrolling in some cases
        event.preventDefault()
        break
      case "Enter":
        event.preventDefault()
        this.select(event)
        // expect the dropdown to hide when its a freetext value
        if (this.selectedIndex === -1 && this.freeTextValue)
          this.hideResultsList(event)

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
    this.searchQueryValue = this.searchInputTarget.value

    if(this.searchInputTarget.value.length === 0 && !this.isMultipleValue){
      if(this.nrOfItems === 1) this.lowLightSelected();
      this.hiddenSelectTarget.innerHTML = ""
      this.hiddenSelectTarget.add(this.createOption())
    }

    if (this.hasUrlValue) {
      this.debouncedFetchResults(event)
    } else {
      this.debouncedLocalResults(event)
    }

    if (!this.isMultipleValue) {
      // set the freetext value as the selected value
      if (this.freeTextValue && this.searchInputTarget.value) {
        this.hiddenSelectTarget.innerHTML = ""
        var option = this.createOption({ text: this.searchInputTarget.value, value: this.searchInputTarget.value })
        this.hiddenSelectTarget.add(option)
      }
    }
  }

  // User presses reset button
  reset(event) {
    if (!this.isMultipleValue) {
      this.hiddenSelectTarget.innerHTML = ""
      this.lastServerRefreshOptions.clear()
      this.selectedItemsTemplateTarget.innerHTML = ""
      this.hiddenSelectTarget.options.add(this.createOption())
    }

    this.searchInputTarget.value = ""
    this.searchQueryValue = null
    this.currentPage = 1
    this.lastSearch = null
    this.lastPage = null
    this.endPage = null

    this.lowLightSelected();
    this.selectedIndex = -1

    if (this.hasUrlValue) {
      this.itemsTarget.innerHTML = ""
    }

    this.itemTargets.forEach((item) => {
      item.classList.remove("hidden")
    })
    this.filterResultsChainTo()

    // hide all results and reset
    this.hideResultsList()

    this.validateSearchQuery()

    if (event) {
      event.preventDefault()
    }

    this.hiddenSelectTarget.dispatchEvent(new Event("change"))
    return false
  }

  // User selects an item using mouse
  select(event) {
    let dataDiv = event.target.closest('[data-satis-dropdown-target="item"]')
    if (dataDiv == null) {
      dataDiv = this.selectedItem
    }
    if (dataDiv == null) return

    this.selectItem(dataDiv, true)

    event.preventDefault()
  }

  selectItem(dataDiv, force = false) {
    const selectedValue = dataDiv.getAttribute("data-satis-dropdown-item-value") || ""
    const selectedValueText = dataDiv.getAttribute("data-satis-dropdown-item-text") || ""
    this.copyItemAttributes(dataDiv, this.hiddenSelectTarget) // FIXME: we are now supporting multiple values; is this needed? We copy the attributes to options

    const option = this.createOption({ text: selectedValueText, value: selectedValue })
    this.copyItemAttributes(dataDiv, option)
    const optionExists = Array.from(this.hiddenSelectTarget.options).some(
      (opt) => opt.value === option.value && this.dataAttributesAreEqual(opt, option)
    )

    // we dont select items that already have been selected, open list
    if (!force) {
      if (optionExists) {
        if (!this.resultsShown) this.showResultsList()
        return
      }
    }

    // clear the search input if we are not in multi select mode
    if (!this.isMultipleValue) {
      this.lastServerRefreshOptions.clear()
      this.hiddenSelectTarget.innerHTML = ""
      this.selectedItemsTemplateTarget.innerHTML = ""
      this.searchInputTarget.value = selectedValueText
    } else
      this.selectedItemsTemplateTarget.content.querySelector(`[data-satis-dropdown-item-value="${selectedValue}"]`)?.remove()

    this.hiddenSelectTarget.add(option)
    this.lastServerRefreshOptions.add(selectedValue)
    this.selectedItemsTemplateTarget.content.appendChild(dataDiv.cloneNode(true))

    this.hiddenSelectTarget.dispatchEvent(new Event("change"))
    this.setSelectedItem(selectedValue)
    this.hideResultsList()
    this.validateSearchQuery()
  }

  setHiddenSelect() {
    if (this.hiddenSelectTarget.options.length === 0) {
      this.searchInputTarget.value = ""
      this.pillsTarget.innerHTML = ""
      this.pillsTarget.classList.add("hidden")
      return true
    }

    if (this.isMultipleValue) {
      Array.from(this.hiddenSelectTarget.options).forEach((opt) => {
        if (!opt.value) return
        const pillExists = this.pillsTarget.querySelector(
          `[data-satis-dropdown-target="pill"] > button[data-satis-dropdown-id-param="${opt.value}"]`
        )
        if (!pillExists) {
          // Add pill to selection
          const pillTemplate = this.pillTemplateTarget.content.firstElementChild.cloneNode(true)
          pillTemplate.prepend(opt.text || opt.value)
          pillTemplate.querySelector("button").setAttribute("data-satis-dropdown-id-param", opt.value)
          this.pillsTarget.appendChild(pillTemplate)
        }
      })

      this.searchInputTarget.value = ""
      this.pillsTarget.classList.remove("hidden")
    } else if (this.hiddenSelectTarget.options.length == 1) {
      const opt = this.hiddenSelectTarget.options[0]
      this.searchInputTarget.value = opt.text
    }
  }

  // --- Helpers

  recordLastSearch() {
    this.lastSearch = this.searchInputTarget.value ? this.searchInputTarget.value : ""
  }

  get searchQueryChanged() {
    const searchQueryValue = this.filteredSearchQuery ? this.filteredSearchQuery : ""
    const lastSearch = this.lastSearch ? this.lastSearch : ""
    return searchQueryValue.length !== lastSearch.length ||
      searchQueryValue.localeCompare(lastSearch, undefined, { sensitivity: "base" }) !== 0
  }

  removePill(event) {
    event.preventDefault()

    this.hiddenSelectTarget.removeChild(this.hiddenSelectTarget.querySelector(`option[value="${event.params.id}"]`))
    this.lastServerRefreshOptions.delete(event.params.id)

    this.pillTargets
      .find((pill) => pill.querySelector("button").getAttribute("data-satis-dropdown-id-param") == event.params.id)
      ?.remove()

    //this.hiddenSelectTarget.dispatchEvent(new Event("change"))
  }

  toggleResultsList(event) {
    if (this.resultsShown) {
      this.hideResultsList(event)

      // Not sure what the intent is, but this causes Safari not to open a ticket
      // } else if (this.element.contains(document.activeElement)) {
    } else {
      this.filterResultsChainTo()

      if(this.hasResults && !this.searchQueryChanged){
        this.showResultsList(event)
      }else {
        if (this.hasUrlValue)
          this.fetchResults(event)
        else
          this.localResults(event)
      }
    }
    return false
  }

  showResultsList(event) {
    this.resultsTarget.classList.remove("hidden")
    this.resultsTarget.setAttribute("data-show", "")
    this.popperInstance.update()
    if (this.hasToggleButtonTarget) {
      this.toggleButtonTarget.querySelector(".fa-chevron-up").classList.remove("hidden")
      this.toggleButtonTarget.querySelector(".fa-chevron-down").classList.add("hidden")
    }
  }

  hideResultsList(event) {
    this.resultsTarget.classList.add("hidden")
    this.resultsTarget.removeAttribute("data-show")
    if (this.hasToggleButtonTarget) {
      this.toggleButtonTarget.querySelector(".fa-chevron-up").classList.add("hidden")
      this.toggleButtonTarget.querySelector(".fa-chevron-down").classList.remove("hidden")
    }
  }

  getChainToElement() {
    return this.hiddenSelectTarget?.form?.querySelector(`[name="${this.chainToValue}"]`)
  }

  filterResultsChainTo() {
    if (!this.chainToValue) {
      return
    }

    let chainToValue
    let chainTo = this.getChainToElement()
    if (chainTo) {
      chainToValue = chainTo.value
    }

    let listItems = 0
    this.itemTargets.forEach((item) => {
      let itemChainToValue = item.getAttribute("data-chain")
      let chainMatch = true
      if (this.chainToValue || itemChainToValue) {
        chainMatch = chainToValue == itemChainToValue
      }

      if (chainMatch) {
        listItems += 1
        item.classList.remove("hidden")
      } else {
        item.classList.add("hidden")
        item.classList.remove("highlighted")
      }
    })
    if (listItems == 1) {
      this.selectItem(this.itemTargets.filter((item) => {
        return item.classList != 'hidden'
      })[0])
    }
  }

  localResults(event) {
    if (!this.searchQueryChanged) {
      if(!this.resultsShown) {
        if (this.hasResults)
          this.showResultsList(event)
        else this.showSelectedItem()
      }
      this.validateSearchQuery()
      return
    }

    this.recordLastSearch()

    // show all items again and count those that were already visible (previously matched)
    let previouslyVisibleItemsCount = 0
    this.itemTargets.forEach((item) => {
      if (item.classList.contains('hidden')) {
        item.classList.remove('hidden')
      } else {
        previouslyVisibleItemsCount++
      }
    });

    this.filterResultsChainTo()

    // hide all items that don't match the search query
    const searchValue = this.searchQueryValue
    let matches = []
    this.itemTargets.forEach((item) => {
      const text = item.getAttribute("data-satis-dropdown-item-text")
      const matched = this.needsExactMatchValue ?
        searchValue.localeCompare(text, undefined, {sensitivity: 'base'}) === 0:
        new RegExp(searchValue, "i").test(text)

      const isHidden = item.classList.contains("hidden")
      if (!isHidden) {
        if (matched) {
          matches.push(item)
        } else {
          item.classList.toggle("hidden", true)
        }
      }
    })

    // don't show results
    if (matches.length > 0) {
      this.showResultsList(event)
    } else {
      if (!this.showSelectedItem())
        this.hideResultsList(event)
    }

    // auto select if there is only one match and we are not in freetext mode
    if(!this.freeTextValue) {
      if (matches.length === 1) {
        if (this.filteredSearchQuery.length >= this.minSearchQueryLength &&
          matches[0].getAttribute("data-satis-dropdown-item-text").toLowerCase().indexOf(this.lastSearch.toLowerCase()) >= 0) {
          const dataDiv = matches[0].closest('[data-satis-dropdown-target="item"]')
          this.selectItem(dataDiv)
          this.setSelectedItem(dataDiv.getAttribute("data-satis-dropdown-item-value"))
          this.searchQueryValue = ""
        } else {
          this.showSelectedItem()
        }
        // the selected item if there was only 1 item visible before
      } else if(previouslyVisibleItemsCount === 1 && matches.length > 1) {
        this.setSelectedItem()
      }
    }

    this.validateSearchQuery()
  }

  // Remote search
  fetchResults(event) {
    const promise = new Promise((resolve, reject) => {
      if (
        (!this.searchQueryChanged &&
          (this.currentPage == this.lastPage || this.currentPage == this.endPage)) ||
        !this.hasUrlValue
      ) {
        if(!this.resultsShown) {
          if (this.hasResults)
            this.showResultsList(event)
          else this.showSelectedItem()
        }
        return
      }

      if (this.searchQueryChanged) {
        this.currentPage = 1
        this.endPage = null
        this.recordLastSearch()
      }

      this.lastPage = this.currentPage

      let ourUrl = this.normalizedUrl()
      let pageSize = this.pageSizeValue

      if (event != null && (this.filteredSearchQuery >= 2 || this.lastSearch)) {
        ourUrl.searchParams.append("term", this.searchQueryValue)
      }


      ourUrl.searchParams.append("page", this.currentPage)
      ourUrl.searchParams.append("page_size", pageSize)
      if (this.needsExactMatchValue) {
        ourUrl.searchParams.append("needs_exact_match", this.needsExactMatchValue)
      }

      this.fetchResultsWith(ourUrl).then((itemCount) => {
        if (this.hasResults) {
          this.filterResultsChainTo()

          if (!this.resultsShown && !this.chainToValue) {
            this.showResultsList()
          }

          // auto select when there is only 1 value
          if (this.filteredSearchQuery.length >= this.minSearchQueryLength && this.nrOfItems === 1 && !this.freeTextValue) {
            const dataDiv = this.itemTargets[0].closest('[data-satis-dropdown-target="item"]')
            this.selectItem(dataDiv)
            this.setSelectedItem(dataDiv.getAttribute("data-satis-dropdown-item-value"))
            this.searchQueryValue = ""
          }

          if (itemCount > 0) {
            this.currentPage += 1
          }

          // when the count < page_size we assume we reached the end of the list (count can be 0)
          if (itemCount != pageSize) {
            this.endPage = this.currentPage
          }

          resolve()
        } else {
          this.showSelectedItem()
        }

        this.validateSearchQuery()
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

  get filteredSearchQuery(){
    if(this.searchQueryValue < this.minSearchQueryLength) return ""
    return this.searchQueryValue
  }

  get selectionChangedSinceLastRefresh() {
    return (
      this.hiddenSelectTarget.options.length !== this.lastServerRefreshOptions.size ||
      !Array.from(this.hiddenSelectTarget.options).every((option) => this.lastServerRefreshOptions.has(option.value))
    )
  }

  refreshSelectionFromServer() {
    if (!this.selectionChangedSinceLastRefresh) return Promise.resolve()

    let updated = 0
    Array.from(this.hiddenSelectTarget.options).forEach((opt) => {
      // try to find the items locally
      let item = this.itemsTarget.querySelector('[data-satis-dropdown-item-value="' + opt.value + '"]')
      if (item) {
        opt.text = item.getAttribute("data-satis-dropdown-item-text")

        // Copy over data attributes on the item div to the option
        this.copyItemAttributes(item, opt)
        this.selectedItemsTemplateTarget.content.appendChild(item.cloneNode(true))
        updated++
      }

      this.lastServerRefreshOptions.add(opt.value)
    })

    if (!this.hasUrlValue || this.hiddenSelectTarget.options.length === updated) return Promise.resolve()

    const promise = new Promise((resolve, reject) => {
      if (!this.hasUrlValue) return

      const ourUrl = this.normalizedUrl()

      let selectedIds = Array.from(this.hiddenSelectTarget.options).map((opt) => opt.value)

      // make sure we get all selected items
      //ourUrl.searchParams.append("page", 1)
      //ourUrl.searchParams.append("page_size", selectedIds.length)
      // parameters with [] will be converted to an array
      if (selectedIds.length > 0)
        selectedIds.forEach((id) => ourUrl.searchParams.append(selectedIds.length === 1 ? "id" : "id[]", id))

      fetch(ourUrl.href, {}).then((response) => {
        if (response.ok)
          response.text().then((data) => {
            let tmpDiv = document.createElement("div")
            tmpDiv.innerHTML = data

            for (let i = 0; i < this.hiddenSelectTarget.options.length; i++) {
              let opt = this.hiddenSelectTarget.options[i]
              let item = tmpDiv.querySelector('[data-satis-dropdown-item-value="' + opt.value + '"]')
              if (!item && !this.freeTextValue) {
                this.selectedItemsTemplateTarget.content.querySelector(`[data-satis-dropdown-item-value="${opt.value}"]`)?.remove()
                opt.remove()
                this.lastServerRefreshOptions.delete(opt.value)
              } else {
                let text = item.getAttribute("data-satis-dropdown-item-text")

                if (opt.text != text) {
                  if (text === "") opt.text = opt.id
                  else opt.text = text
                }

                // Copy over data attributes on the item div to the option
                this.copyItemAttributes(item, opt)
                this.selectedItemsTemplateTarget.content.appendChild(item.cloneNode(true))
              }
            }

            // blank option
            if (this.hiddenSelectTarget.options.length === 0) {
              let option = this.createOption()
              this.hiddenSelectTarget.options.add(option)
              this.lastServerRefreshOptions.add(option.value)
            }

            resolve()
          })
      })
    })
    return promise
  }

  normalizedUrl() {
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

    let chainTo = this.getChainToElement()
    if (chainTo) {
      let chainToParam = chainTo
        .getAttribute("name")
        .substring(chainTo.getAttribute("name").lastIndexOf("[") + 1, chainTo.getAttribute("name").lastIndexOf("]"))
      ourUrl.searchParams.append(chainToParam, chainTo.value)
    }

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
    if (this.selectedIndex === -1) return
    return this.itemTargets.filter((item) => {
      return !item.classList.contains("hidden")
    })[this.selectedIndex]
  }

  lowLightSelected() {
    this.itemsTarget.querySelectorAll('.highlighted[data-satis-dropdown-target="item"]').forEach((item) => {
      item.classList.toggle("highlighted")
    })
  }

  highLightSelected() {
    const selectedItem = this.selectedItem
    if (selectedItem) {
      selectedItem.classList.toggle("highlighted", true)
      selectedItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
    }
  }

  /*
    * Set the selected item base on an the items 'data-satis-dropdown-item-value' attribute
    * @param {string} value - The value to match the item against
   */
  setSelectedItem(value) {
    this.lowLightSelected()
    if (!value) {
      this.selectedIndex = -1
      return
    }
    const itemTargets = this.itemTargets;
    const visibleItems = itemTargets.filter(item => !item.classList.contains("hidden"));
    this.selectedIndex = visibleItems.findIndex(item => item.getAttribute("data-satis-dropdown-item-value") === value);
    this.highLightSelected()
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
  validateSearchQuery() {
    const trimmedValue = this.searchInputTarget.value.trim();
    const elements = this.selectedItemsTemplateTarget.content.querySelectorAll(`[data-satis-dropdown-item-text*="${trimmedValue}"]`);
    const selected = Array.from(elements).find(element => element.getAttribute('data-satis-dropdown-item-text').trim() === trimmedValue);
    if (!selected && this.searchInputTarget.value.length > 0 && !this.freeTextValue) {
      this.searchInputTarget.closest(".bg-white").classList.toggle("warning", true)
    } else {
      this.searchInputTarget.closest(".bg-white").classList.toggle("warning", false)
    }
  }

  // clear search input and hide results
  resetSearchInput(event) {
    if (this.multiSelectValue) {
      this.searchInputTarget.value = ""
    } else {
      if (this.hiddenSelectTarget.options.length > 0) {
        const option = this.hiddenSelectTarget.options[0]
        this.searchInputTarget.value = option.text
      }
    }

    if (this.resultsShown) {
      this.hideResultsList(event)
    }

    this.validateSearchQuery()
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

  copyItemAttributes(item, dest) {
    Array.prototype.slice.call(item.attributes).forEach((attr) => {
      if (attr.name.startsWith("data") && !attr.name.startsWith("data-satis") && !attr.name.startsWith("data-action")) {
        dest.setAttribute(attr.name, attr.value)
      }
    })
  }

  createOption(options) {
    options = Object.assign({ text: "", value: "", selected: true }, options)

    let option = document.createElement("option")
    option.text = options.text
    option.value = options.value
    option.setAttribute("selected", options.selected)
    return option
  }

  dataAttributesAreEqual(el1, el2) {
    const keys1 = Object.keys(el1.dataset)
    const keys2 = Object.keys(el2.dataset)
    if (keys1.length !== keys2.length) return false

    for (const key of keys1) {
      if (el1.dataset[key] !== el2.dataset[key]) {
        return false
      }
    }
    return true
  }

  get hasFocus() {
    const activeElement = document.activeElement;
    if (activeElement === this.element ||
      this.element.contains(activeElement) ||
      this.element.querySelector(':focus') !== null) {
      return true;
    }
    return false;
  }

  // Selected items are being cached in selectItemsTemplate. Sometimes we want to show the selected item in the results list
  // As the selected item may not be in the results list, we cache the item in the template and re-add it when needed.
  showSelectedItem() {
    if (this.isMultipleValue
      || this.freeTextValue
      || this.hiddenSelectTarget.options.length === 0
      || !this.hasFocus
    ) return false;

    const option = this.hiddenSelectTarget.options[0]
    let item = this.itemsTarget.querySelector(`[data-satis-dropdown-item-value="${option.value}"]`)
    if (item) {
      item.classList.remove("hidden")
    } else {
      item = this.selectedItemsTemplateTarget.content.querySelector(`[data-satis-dropdown-item-value="${option.value}"]`)
      if (item) {
        item = item.cloneNode(true)
        item.classList.remove("hidden")
        item.setAttribute("data-satis-dropdown-target", "item")
        item.setAttribute("data-action", "click->satis-dropdown#select")
        this.itemsTarget.appendChild(item)
      }
    }

    if(item) {
      if (!this.resultsShown)
        this.showResultsList()
      this.setSelectedItem(option.value)
    }

    return item != null;
  }
}
