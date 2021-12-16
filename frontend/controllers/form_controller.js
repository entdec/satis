import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = []
  static values = {
    noSubmitOnEnter: Boolean,
    confirmBeforeLeave: Boolean
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

    if (this.confirmBeforeLeaveValue) {
      this.originalData = this.getFormData()
      document.addEventListener('turbo:before-visit', this.checkForChanges.bind(this))
    }
  }

  checkForChanges(event) {
    if (this.isDirty() && ! window.confirm("Changes you made may not be saved, are you sure you want to leave this page?")) {
      event.preventDefault()
    }
  }

  getFormData() {
    return new URLSearchParams(new FormData(this.element)).toString()
  }

  isDirty() {
    return this.originalData != this.getFormData()
  }
}
