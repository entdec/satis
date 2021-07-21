import ApplicationController from "../../../../frontend/controllers/application_controller"
import { createPopper } from "@popperjs/core"
import { debounce } from "../../../../frontend/utils"

export default class extends ApplicationController {
  static targets = ["hours", "minutes", "month", "year", "days", "weekDays", "calendarView", "weekDayTemplate", "emtpyTemplate", "dayTemplate"]
  static values = {
    visibleMonths: Number,
    weekStart: String,
    format: String,
    clearable: Boolean,
    inline: Boolean,
    range: Boolean,
    multiple: Boolean,
    timePicker: Boolean,
  }

  connect() {
    let today = new Date()

    this.currentDate = today

    this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString()

    this.display()

    this.popperInstance = createPopper(this.element, this.calendarViewTarget, {
      offset: [-20, 2],
      placement: "bottom-start",
      modifiers: [
        {
          name: "flip",
          enabled: true,
          options: {
            boundary: this.element.closest(".satis-card"),
          },
        },
        {
          name: "preventOverflow",
        },
      ],
    })

    this.boundClickedOutside = this.clickedOutside.bind(this)
    if (!this.inlineValue) {
      window.addEventListener("click", this.boundClickedOutside)
    }
  }

  disconnect() {
    window.removeEventListener("click", this.boundClickedOutside)
  }

  clear(event) {}

  showCalendar(event) {
    this.calendarViewTarget.classList.remove("hidden")
    this.calendarViewTarget.setAttribute("data-show", "")
    this.popperInstance.update()
  }

  hideCalendar(event) {
    this.calendarViewTarget.classList.add("hidden")
    this.calendarViewTarget.removeAttribute("data-show")
  }

  previousMonth() {
    this.currentDate = new Date(new Date(this.currentDate).setMonth(this.currentDate.getMonth() - 1))
    this.display()
  }

  nextMonth() {
    this.currentDate = new Date(new Date(this.currentDate).setMonth(this.currentDate.getMonth() + 1))
    this.display()
  }

  display() {
    this.monthTarget.innerHTML = this.monthName
    this.yearTarget.innerHTML = this.currentDate.getFullYear()

    this.weekDaysTarget.innerHTML = ""
    this.getWeekDays("en-US").forEach((dayName) => {
      this.weekDaysTarget.insertAdjacentHTML("beforeend", this.weekDayTemplateTarget.innerHTML.replace(/\${name}/g, dayName))
    })

    // Deal with AM/PM
    // new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

    this.hoursTarget.value = ("" + this.currentDate.getHours()).padStart(2, "0")
    this.minutesTarget.value = ("" + this.currentDate.getMinutes()).padStart(2, "0")
    this.daysTarget.innerHTML = ""
    this.monthDays.forEach((day) => {
      if (day == " ") {
        this.daysTarget.insertAdjacentHTML("beforeend", this.emtpyTemplateTarget.innerHTML)
      } else {
        let date = new Date(new Date(this.currentDate).setDate(day))
        if (this.isToday(date)) {
          let tmpDiv = document.createElement("div")
          tmpDiv.innerHTML = this.dayTemplateTarget.innerHTML.replace(/\${day}/g, day)
          let div = tmpDiv.querySelector(".text-center")
          div.classList.add("border-red-500", "border")

          this.daysTarget.insertAdjacentHTML("beforeend", tmpDiv.innerHTML)
        } else {
          this.daysTarget.insertAdjacentHTML("beforeend", this.dayTemplateTarget.innerHTML.replace(/\${day}/g, day))
        }
      }
    })
  }

  isToday(date) {
    const today = new Date()
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }

  get monthName() {
    return new Date(this.currentDate).toLocaleString("default", { month: "long" })
  }

  getWeekDays(locale) {
    const baseDate = this.weekStartValue == "sun" ? new Date(Date.UTC(2021, 1, 0)) : new Date(Date.UTC(2021, 1, 1))
    let weekDays = []
    for (let i = 0; i < 7; i++) {
      weekDays.push(baseDate.toLocaleDateString(locale, { weekday: "short" }))
      baseDate.setDate(baseDate.getDate() + 1)
    }
    return weekDays
  }

  // Gets the list of days
  get monthDays() {
    let results = []

    let monthStart = this.currentDate.getDay()
    if (this.weekStartValue == "sun") {
      monthStart = monthStart + 1
    }
    let monthEnd = new Date(new Date(new Date(this.currentDate).setMonth(this.currentDate.getMonth() + 1)).setDate(0)).getDate()

    for (let index = 0; index < monthStart; index++) {
      results.push(" ")
    }

    for (let index = 1; index <= monthEnd; index++) {
      results.push(index)
    }

    return results
  }

  clickedOutside(event) {
    if (event.target.tagName == "svg" || event.target.tagName == "path") {
      return
    }
    if (!this.element.contains(event.target)) {
      this.hideCalendar()
    }
  }
}
