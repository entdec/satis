import ApplicationController from "./application_controller"
import intlTelInput from "intl-tel-input"
import debounce from "lodash/debounce"

export default class extends ApplicationController {
  static targets = ["input", "hiddenInput"]

  initialize() {
    super.initialize()
    this.change = debounce(this.change, 500).bind(this)
  }

  connect() {
    super.connect()
    console.log("hi")
    this.instance = intlTelInput(this.inputTarget, {
      initialCountry: "nl",
      formatOnInit: true,
      preferredCountries: ["nl", "de", "gb", "fr", "us", "es", "be", "se"],
      nationalMode: false,
      utilsScript: "/javascripts/utils.js",
    })
  }

  change(event) {
    this.hiddenInputTarget.value = this.instance.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL)
  }
}
