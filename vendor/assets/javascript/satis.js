import DropdownController from "./controllers/dropdown_component_controller"

export class Satis {
  static start(application) {
    console.log("Satis")

    application.register("satis-dropdown", DropdownController)
  }
}
