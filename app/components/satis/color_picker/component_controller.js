import ApplicationController from "satis/controllers/application_controller"
import * as dummy from "pickr";

export default class ColorPickerComponentController extends ApplicationController {
  static targets = ["picker", "input"]
  static values = { submit: Boolean, cssVariable: String, cssScope: String }

  connect() {
    this.setupPickr();
    this.pickr.on('save', (color, _instance) => {
      this.inputTarget.value = color.toHEXA().toString();

      this.pickr.hide();

      if (this.submitValue && !this.forcedUpdate) {
        this.inputTarget.form.submit();
      }

      if (this.cssVariableValue) {
        var element = this.cssScopeValue ? document.querySelector(this.cssScopeValue) : document.documentElement;
        console.log(element, this.cssScopeValue);
        element.style.setProperty(this.cssVariableValue, this.inputTarget.value);
      }
    });
  }

  disconnect() {
    if (this.pickr) {
      this.pickr.destroyAndRemove();
    }
  }

  setupPickr() {
    this.pickr = Pickr.create({
      el: this.element.querySelector('.picker'),
      theme: 'classic',
      default: this.inputTarget.value,

      components: {
        preview: true,
        opacity: false,
        hue: true,

        interaction: {
          hex: true,
          rgba: false,
          hsla: false,
          hsva: false,
          cmyk: false,
          input: true,
          clear: false,
          save: true,
        },
      },
    });
  }

  inputUpdate() {
    if (this.pickr) {
      this.pickr.setColor(this.inputTarget.value);
    }
  }
} 
