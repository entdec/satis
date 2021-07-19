import ApplicationController from "./application_controller"

/*
 * Theme controller
 *
 *   div data-controller="satis-link" href="" data-action='click->satis-link#select'
 *
 */
export default class extends ApplicationController {
  connect() {
    super.connect()
  }

  select() {
    Turbo.visit(this.element.getAttribute("href"))
  }
}
