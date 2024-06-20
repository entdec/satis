import ApplicationController from "satis/controllers/application_controller"

export default class DialogComponentController extends ApplicationController {
  connect () {
    super.connect()
  }

  disconnect () {

  }

  close() {
    this.element.parentElement.removeAttribute("src")
    this.element.remove()
  }
}