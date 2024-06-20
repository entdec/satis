import ApplicationController from "satis/controllers/application_controller"

export default class PageComponentController extends ApplicationController {
  static targets = ["closeButton", "openButton", "offCanvasMenu", "overlay", "dialog"]
  connect() {
    super.connect()
  }

  close(event) {
    // | Entering: "transition-opacity ease-linear duration-300"
    // | From: "opacity-0"
    // | To: "opacity-100"
    // | Leaving: "transition-opacity ease-linear duration-300"
    // | From: "opacity-100"
    // | To: "opacity-0"
    // overlay
    this.overlayTarget.classList.add("transition-opacity", "ease-linear", "duration-300", "opacity-0")

    // | Entering: "transition ease-in-out duration-300 transform"
    // | From: "-translate-x-full"
    // | To: "translate-x-0"
    // | Leaving: "transition ease-in-out duration-300 transform"
    // | From: "translate-x-0"
    // | To: "-translate-x-full"
    // offCanvasMenu
    this.offCanvasMenuTarget.classList.add("transition", "ease-in-out", "duration-1000")

    // | Entering: "ease-in-out duration-300"
    // | From: "opacity-0"
    // | To: "opacity-100"
    // | Leaving: "ease-in-out duration-300"
    // | From: "opacity-100"
    // | To: "opacity-0"
    // closeButton
    this.closeButtonTarget.classList.add("ease-in-out", "duration-300", "opacity-0")

    setTimeout(() => {
      this.dialogTarget.classList.add("hidden")
      this.overlayTarget.classList.add("hidden")
      this.offCanvasMenuTarget.classList.add("hidden")
      this.closeButtonTarget.classList.add("hidden")

      this.overlayTarget.classList.remove("transition-opacity", "ease-linear", "duration-300")
      this.offCanvasMenuTarget.classList.remove("transition", "ease-in-out", "duration-300")
      this.closeButtonTarget.classList.remove("ease-in-out", "duration-300")
    }, 100)
  }

  open(event) {
    this.dialogTarget.classList.remove("hidden")
    this.overlayTarget.classList.remove("hidden")
    this.offCanvasMenuTarget.classList.remove("hidden")
    this.closeButtonTarget.classList.remove("hidden")

    // | Entering: "transition-opacity ease-linear duration-300"
    // | From: "opacity-0"
    // | To: "opacity-100"
    // | Leaving: "transition-opacity ease-linear duration-300"
    // | From: "opacity-100"
    // | To: "opacity-0"
    // overlay
    this.overlayTarget.classList.remove("opacity-0")
    this.overlayTarget.classList.add("transition-opacity", "ease-linear", "duration-300", "opacity-100")

    // | Entering: "transition ease-in-out duration-300 transform"
    // | From: "-translate-x-full"
    // | To: "translate-x-0"
    // | Leaving: "transition ease-in-out duration-300 transform"
    // | From: "translate-x-0"
    // | To: "-translate-x-full"
    // offCanvasMenu
    this.offCanvasMenuTarget.classList.add("transition", "ease-in-out", "duration-1000")
    this.offCanvasMenuTarget.classList.remove("-translate-x-full")
    this.offCanvasMenuTarget.classList.add("transition", "ease-in-out", "duration-1000", "transform", "translate-x-0")

    // | Entering: "ease-in-out duration-300"
    // | From: "opacity-0"
    // | To: "opacity-100"
    // | Leaving: "ease-in-out duration-300"
    // | From: "opacity-100"
    // | To: "opacity-0"
    // closeButton
    this.closeButtonTarget.classList.remove("opacity-0")
    this.closeButtonTarget.classList.add("ease-in-out", "duration-300", "opacity-100")
  }
}
