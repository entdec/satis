import ApplicationController from "../../../../frontend/controllers/application_controller"

export default class extends ApplicationController {
  connect() {
    this.today = new Date()
    this.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


  }
}
