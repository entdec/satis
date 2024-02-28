import ApplicationController from "satis/controllers/application_controller"
import { getInitialTheme } from "utils"

/*
 * Theme controller
 *
 *   div data-controller="satis-appearance-switcher" data-action='click->satis-appearance-switcher#switch'
 *     i.fal.fa-sun data-satis-appearance-switcher-target="light"
 *     i.fal.fa-moon-stars data-satis-appearance-switcher-target="dark"
 *
 */
export default class AppearanceSwitcherComponentController extends ApplicationController {
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
    const eventLight = new CustomEvent('theme-change', { detail: { theme: 'light' } });
    const eventDark = new CustomEvent('theme-change', { detail: { theme: 'dark' } });
    const isDark = rawTheme === "dark"

    if (delay == true) {
      this.lightTarget.classList.add("transition", "ease-in-out", "duration-1000")
      this.darkTarget.classList.add("transition", "ease-in-out", "duration-1000")
    }

    if (isDark) {
      window.dispatchEvent(eventDark);
      this.lightTarget.classList.add("transform", "translate-y-7")
      this.darkTarget.classList.remove("transform", "-translate-y-7")
    } else {
      window.dispatchEvent(eventLight);
      this.lightTarget.classList.remove("transform", "translate-y-7")
      this.darkTarget.classList.add("transform", "-translate-y-7")
    }

    localStorage.setItem("color-theme", rawTheme)
    setTimeout(
      () => {
        root.classList.remove(isDark ? "light" : "dark")
        root.classList.add(rawTheme)
      },
      delay ? 500 : 0
    )
  }
}
