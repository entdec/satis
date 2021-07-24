import ApplicationController from "./application_controller"
import { getInitialTheme } from "../utils"

/*
 * Theme controller
 *
 *   div data-controller="satis-theme" data-action='click->satis-theme#switch'
 *     i.fal.fa-sun
 *     i.fal.fa-moon-stars
 *
 */
export default class extends ApplicationController {
  static targets = ["light", "dark"]
  connect() {
    super.connect()

    const theme = getInitialTheme()
    this.rawSetTheme(theme)
  }

  switch() {
    const theme = getInitialTheme()
    if (theme == "dark") {
      this.rawSetTheme("light")
    } else {
      this.rawSetTheme("dark")
    }
  }

  rawSetTheme(rawTheme) {
    const root = window.document.documentElement
    const isDark = rawTheme === "dark"

    root.classList.remove(isDark ? "light" : "dark")
    root.classList.add(rawTheme)

    if (isDark) {
      this.darkTarget.classList.remove("hidden")
      this.lightTarget.classList.add("hidden")
    } else {
      this.darkTarget.classList.add("hidden")
      this.lightTarget.classList.remove("hidden")
    }

    localStorage.setItem("color-theme", rawTheme)
  }
}
