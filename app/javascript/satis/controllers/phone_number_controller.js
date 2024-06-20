import ApplicationController from "satis/controllers/application_controller"
import {debounce} from "satis/utils"
import * as dummy1 from "intl-tel-input"
import * as dummy2 from "intl-tel-input-utils"

export default class PhoneNumberController extends ApplicationController {
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
      utilsScript: intlTelInputUtils,
      dropdownContainer: document.body,
    })
  }

  change(event) {
    this.hiddenInputTarget.value = this.instance.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL)
    this.inputTarget.value = this.instance.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL)
  }
}
