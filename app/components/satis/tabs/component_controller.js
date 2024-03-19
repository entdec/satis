import ApplicationController from "satis/controllers/application_controller"

/*
 * Tabs controller
 */
export default class TabsComponentController extends ApplicationController {
  static targets = ["tab", "content", "select"]
  static values = { persist: Boolean, key: String }

  connect() {
    super.connect()

    let firstErrorIndex
    this.tabTargets.forEach((tab, index) => {
      let hasErrors = this.contentTargets[index].querySelectorAll(".is-invalid")
      if (hasErrors.length > 0) {
        if (!firstErrorIndex) {
          firstErrorIndex = index
        }
        tab.classList.add("is-invalid")
      }
    })

    if (this.keyValue) {
      this.getUserData(this.keyValue).then((data) => {
        this.open(firstErrorIndex || data?.tab_index || 0)
      })
    } else {
      this.open(firstErrorIndex || 0)
    }
  }

  selectFromKeyboard(event) {
    const isNumber = isFinite(event.key)

    if (isNumber) {
      let index = Number(event.key) - 1
      if (index === -1) {
        index = 9
      }

      this.open(index, true)
    }
  }

  select(event) {
    let index = null
    if (event.srcElement.tagName == "SELECT") {
      index = event.srcElement.selectedIndex
    } else {
      let clickedTab = event.srcElement.closest(".tab")
      index = this.tabTargets.findIndex((el) => {
        return el.attributes["id"] === clickedTab.attributes["id"]
      })
    }
    this.open(index, true)

    if (this.keyValue) {
      this.setUserData(this.keyValue, { tab_index: index }).then((data) => {
        //console.log(data)
      })
    }

    // Cancel the this event (dont show the browser context menu)
    event.preventDefault()
    return false
  }

  open(index, focusFirstElement = false) {
    const self = this
    if (index == -1 || this.tabTargets[index] === undefined) {
      return
    }

    this.tabTargets.forEach(function (target) {
      target.classList.remove("selected")
    })
    this.tabTargets[index].classList.add("selected")

    this.contentTargets.forEach(function (target) {
      target.classList.remove("selected")
    })
    this.contentTargets[index].classList.add("selected")
    setTimeout(() => {
      let turboFrame = this.contentTargets[index].querySelector("turbo-frame")
      if (turboFrame && turboFrame.ariaBusy != "true") {
        let loading = turboFrame.getAttribute("loading")
        turboFrame.setAttribute("loading", "eager")
        turboFrame.reload()
        turboFrame.setAttribute("loading", loading)
      }
    }, 100)
    this.selectTarget.selectedIndex = index

    //focus first element in tab content for easy switching to another one tab
    if (focusFirstElement) {
      this.contentTargets[index]
        .querySelector("select:not(.hidden), input:not([type=hidden]), textarea:not(.hidden), button:not([disabled])")
        ?.focus()
    }
  }
}
