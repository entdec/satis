import ApplicationController from "controllers/application_controller"
import { debounce } from "utils"

export default class SidebarMenuComponentController extends ApplicationController {
  connect() {
    super.connect()
    console.log("sidebar")
  }
}
