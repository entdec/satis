import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = []
  static values = {
    noSubmitOnEnter: Boolean,
    confirmBeforeLeave: Boolean
  }

  connect() {
    super.connect()

    this.formSubmitting = false
    this.element.addEventListener('submit', this.setFormSubmitting.bind(this))

    if (this.noSubmitOnEnterValue) {
      this.element.addEventListener('keydown', function(event) {
        if (event.key == 'Enter' && event.target && event.target.nodeName != 'TEXTAREA') {
          event.preventDefault()
        }
      })
    }

    this.boundCheckForChanges = this.checkForChanges.bind(this)
    this.boundCheckForChangesBeforeUnload = this.checkForChangesBeforeUnload.bind(this)

    if (this.confirmBeforeLeaveValue) {
      this.originalData = this.getFormData()
      document.addEventListener('turbo:before-visit', this.boundCheckForChanges)
      window.addEventListener('beforeunload', this.boundCheckForChangesBeforeUnload)
    }
  }

  disconnect() {
    document.removeEventListener('turbo:before-visit', this.boundCheckForChanges)
    window.removeEventListener('beforeunload', this.boundCheckForChangesBeforeUnload)
  }

  checkForChanges(event) {
    if (this.isDirty() && ! this.formSubmitting && ! window.confirm("Changes you made may not be saved, are you sure you want to leave this page?")) {
      event.preventDefault()
    }
  }

  checkForChangesBeforeUnload(event) {
    if (this.isDirty() && ! this.formSubmitting) {
      event.preventDefault()
      return "Changes you made may not be saved, are you sure you want to leave this page?"
    }
  }

  getFormData() {
    return new URLSearchParams(new FormData(this.element)).toString()
  }

  isDirty() {
    return this.originalData != this.getFormData()
  }

  setFormSubmitting(event) {
    this.formSubmitting = true
  }
}
