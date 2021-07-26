import ApplicationController from "../../../../frontend/controllers/application_controller"

/*
 * Tabs controller
 */
export default class extends ApplicationController {
  static targets = ["tab", "content", "select"]
  static values = { persist: Boolean }

  static keyBindings = [
    {
      keys: ["ctrl+1", "ctrl+2", "ctrl+3", "ctrl+4", "ctrl+5", "ctrl+6", "ctrl+7", "ctrl+8", "ctrl+9", "ctrl+0"],
      handler: (event, combo, controller) => {
        let index = -1 + +combo.split("+")[1]
        if (index == -1) {
          index = 10
        }
        controller.open(index)
      },
    },
  ]

  connect() {
    super.connect()

    const ourUrl = new URL(window.location.href)
    this.keyBase = ourUrl.pathname.substring(1, ourUrl.pathname.length).replace(/\//, "_") + "_tabs_" + this.context.scope.element.id

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

    this.open(firstErrorIndex || this.tabToOpen())
  }

  select(event) {
    let index = null
    if (event.srcElement.tagName == "SELECT") {
      index = event.srcElement.selectedIndex
    } else {
      let clickedTab = event.srcElement.closest("a")
      index = this.tabTargets.findIndex((el) => {
        return el.attributes["id"] === clickedTab.attributes["id"]
      })
    }
    this.open(index)
    this.storeValue("openTab", index)

    // Cancel the this event (dont show the browser context menu)
    event.preventDefault()
    return false
  }

  open(index) {
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
    this.selectTarget.selectedIndex = index
  }

  storeValue(key, value) {
    if (!this.persistValue) {
      return
    }

    if (typeof Storage !== "undefined") {
      sessionStorage.setItem(this.keyBase + "_" + key, value)
    }
  }

  getValue(key) {
    if (!this.persistValue) {
      return
    }

    if (typeof Storage !== "undefined") {
      return sessionStorage.getItem(this.keyBase + "_" + key)
    }
  }

  disconnect() {}

  tabToOpen() {
    let urlValue = this.getUrlVar(this.context.scope.element.id + "Tab")

    if (typeof urlValue !== "undefined") {
      return urlValue
    }

    return this.getValue("openTab") || 0
  }

  getUrlVar(name) {
    return this.getUrlVars()[name]
  }

  getUrlVars() {
    let vars = {}

    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value
    })

    return vars
  }
}
