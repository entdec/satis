// application_controller.js
import { Controller } from "@hotwired/stimulus"

export default class ApplicationController extends Controller {
  connect() {
    this.element[this.identifier] = this
  }

  getController(element, identifier) {
    return this.application.getControllerForElementAndIdentifier(element, identifier)
  }

  triggerEvent(el, name, data) {
    let event
    if (typeof window.CustomEvent === "function") {
      event = new CustomEvent(name, { detail: data })
    } else {
      event = document.createEvent("CustomEvent")
      event.initCustomEvent(name, true, true, data)
    }
    el.dispatchEvent(event)
  }

  elementScrolled(element) {
    if (element.offsetHeight + element.scrollTop === element.scrollHeight) {
      return true
    }
    return false
  }
}
