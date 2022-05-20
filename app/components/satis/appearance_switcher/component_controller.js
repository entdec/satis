import ApplicationController from "../../../../frontend/controllers/application_controller"
import { getInitialTheme } from "../../../../frontend/utils"

/*
 * Theme controller
 *
 *   div data-controller="satis-appearance-switcher" data-action='click->satis-appearance-switcher#switch'
 *     i.fal.fa-sun data-satis-appearance-switcher-target="light"
 *     i.fal.fa-moon-stars data-satis-appearance-switcher-target="dark"
 *
 */
export default class extends ApplicationController {
  static targets = ["light", "dark"]
  connect() {
    super.connect()

    const theme = getInitialTheme()
    this.rawSetTheme(theme, false)
  }

  switch() {
    const theme = getInitialTheme()
    if (theme == "dark") {
      this.rawSetTheme("light", true)
    } else {
      this.rawSetTheme("dark", true)
    }
  }

  rawSetTheme(rawTheme, delay) {
    const root = window.document.documentElement
    const isDark = rawTheme === "dark"

    if (delay == true) {
      this.lightTarget.classList.add("transition", "ease-in-out", "duration-800")
      this.darkTarget.classList.add("transition", "ease-in-out", "duration-800")
    }

    if (isDark) {
      this.lightTarget.classList.add("transform", "translate-y-7")
      this.darkTarget.classList.remove("transform", "-translate-y-7")
    } else {
      this.lightTarget.classList.remove("transform", "translate-y-7")
      this.darkTarget.classList.add("transform", "-translate-y-7")
    }

    localStorage.setItem("color-theme", rawTheme)
    setTimeout(
      () => {
        root.classList.remove(isDark ? "light" : "dark")
        root.classList.add(rawTheme)
      },
      delay ? 400 : 0
    )
  }
}
