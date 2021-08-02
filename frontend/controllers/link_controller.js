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

  follow() {
    if (this.element.getAttribute("data-turbo") == "false") {
      window.open(this.element.getAttribute("href"), this.element.getAttribute("target"))
    } else {
      Turbo.visit(this.element.getAttribute("href"))
    }
  }
}
