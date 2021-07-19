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

    localStorage.setItem("color-theme", rawTheme)
  }
}
