import ApplicationController from "../../../../frontend/controllers/application_controller"

/*
 * Tabs controller
 */
export default class extends ApplicationController {
  static targets = ["tab", "content", "select"]

  connect() {
    this.keyBase = "tabs_" + this.context.scope.element.id
    this.state = this.data.get("state") == "true"

    this.open(this.tabToOpen())
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
    if (!this.state) {
      return
    }

    if (typeof Storage !== "undefined") {
      sessionStorage.setItem(this.keyBase + "_" + key, value)
    }
  }

  getValue(key) {
    if (!this.state) {
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
