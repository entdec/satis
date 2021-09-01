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
    if (event.target.tagName == "A" || (event.target.tagName == "svg" && event.target != this.element)) {
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
