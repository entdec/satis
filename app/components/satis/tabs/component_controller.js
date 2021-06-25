import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["tab", "content"]

  connect() {
    console.log("hi tabs")
    this.keyBase = "tabs_" + this.context.scope.element.id
    this.state = this.data.get("state") == "true"

    this.open(this.tabToOpen())
  }

  select(event) {
    let clickedTab = event.srcElement.closest(".ui-tabs-tab")
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
      target.classList.remove("open")
    })
    this.tabTargets[index].classList.add("open")
    this.contentTargets.forEach(function (target) {
      target.classList.remove("open")
    })
    this.contentTargets[index].classList.add("open")
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
