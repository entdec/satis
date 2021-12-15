import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = []
  static values = {
    noSubmitOnEnter: Boolean
  }

  connect() {
    super.connect()

    if (this.noSubmitOnEnterValue) {
      this.element.addEventListener('keydown', function(event) {
        if (event.key == 'Enter' && event.target && event.target.nodeName != 'TEXTAREA') {
          event.preventDefault()
        }
      })
    }
  }
}
