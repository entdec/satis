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
      event = new CustomEvent(name, { detail: data, cancelable: true, bubbles: true })
    } else {
      event = document.createEvent("CustomEvent")
      event.initCustomEvent(name, true, true, data)
    }
    el.dispatchEvent(event)
  }

  elementScrolled(element) {
    if (element.scrollHeight - Math.round(element.scrollTop) === element.clientHeight) {
      return true
    }
    return false
  }

  getUserData(key) {
    return fetch("/satis/user_data/" + key, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            return data
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  setUserData(key, data) {
    if(event.target.innerHTML == 'Delete view') {
      return false
    }
    let csrfToken = document.querySelector("meta[name=csrf-token]").content
    return fetch("/satis/user_data/" + key, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            return data
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
