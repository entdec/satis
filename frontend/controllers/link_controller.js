import ApplicationController from "./application_controller"

/*
 * Link controller
 *
 *   div data-controller="satis-link" href="" data-turbo="false" target="_blank" data-action='click->satis-link#follow'
 *
 */
export default class extends ApplicationController {
  connect() {
    super.connect()
  }

  follow(event) {
    if (event.target.tagName != this.element.tagName && event.target.closest(this.element.tagName.toLowerCase()) != this.element) {
      // Don't do this anymore when both tagNames are the same (the one you click and the element with the controller
      // This is in to make sure row-links using satis-link controller will not trigger when an A or an SVG in that A is triggered.
      return
    }

    if (event.target != this.element && event.target.closest('a') != undefined) {
      // There is an 'a' tag inside the 'satis-link' tag, and we just clicked on it.
      return
    }

    if (event.metaKey || event.ctrlKey) {
      window.open(this.element.getAttribute("href"), "_blank")
    } else if (this.element.getAttribute("data-turbo") == "false") {
      window.open(this.element.getAttribute("href"), this.element.getAttribute("target"))
    } else {
      Turbo.visit(this.element.getAttribute("href"))
    }
  }
}
