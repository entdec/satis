// application_controller.js
import { Controller } from "stimulus"

export default class ApplicationController extends Controller {
  getController(element, identifier) {
    return this.application.getControllerForElementAndIdentifier(element, identifier)
  }

  triggerEvent(el, name, data) {
    if (typeof window.CustomEvent === "function") {
      let event = new CustomEvent(name, { detail: data })
    } else {
      let event = document.createEvent("CustomEvent")
      event.initCustomEvent(name, true, true, data)
    }
    el.dispatchEvent(event)
  }
}
