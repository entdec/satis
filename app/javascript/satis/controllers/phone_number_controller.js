import ApplicationController from "satis/controllers/application_controller"
// import intlTelInput from "intl-tel-input"
import {debounce} from "utils"
// import intlTelInputUtilsUrl from "intl-tel-input/build/js/utils.js"

export default class extends ApplicationController {
  static targets = ["input", "hiddenInput"]

  initialize() {
    super.initialize()
    this.change = debounce(this.change, 500).bind(this)
  }

  connect() {
    super.connect()
    this.instance = intlTelInput(this.inputTarget, {
      initialCountry: "nl",
      formatOnInit: true,
      preferredCountries: ["nl", "de", "gb", "fr", "us", "es", "be", "se"],
      nationalMode: false,
      utilsScript: intlTelInputUtilsUrl,
      dropdownContainer: document.body,
    })
  }

  change(event) {
    this.hiddenInputTarget.value = this.instance.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL)
    this.inputTarget.value = this.instance.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL)
  }
}
