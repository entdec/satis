import { Controller } from "stimulus"

/*
 * Tabs controller
 */
export default class extends Controller {
  static targets = ["tab", "content"]

  connect() {
    this.keyBase = "tabs_" + this.context.scope.element.id
    this.state = this.data.get("state") == "true"

    this.open(this.tabToOpen())
  }

  select(event) {
    let clickedTab = event.srcElement.closest("a")
    let index = this.tabTargets.findIndex((el) => {
      return el.attributes["id"] === clickedTab.attributes["id"]
    })
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
