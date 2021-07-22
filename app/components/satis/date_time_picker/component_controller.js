import ApplicationController from "../../../../frontend/controllers/application_controller"
import { createPopper } from "@popperjs/core"
import { debounce } from "../../../../frontend/utils"

export default class extends ApplicationController {
  static targets = ["input", "hiddenInput", "clearButton", "hours", "minutes", "month", "year", "days", "weekDays", "calendarView", "weekDayTemplate", "emtpyTemplate", "dayTemplate"]
  static values = {
    locale: String, // Which locale should be used, if nothing entered, browser locale is used
    // visibleMonths: Number,
    weekStart: String, // On which day do we start the week. Only sun and mon are supported atm.
    format: Object, // JSON date-format - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    clearable: Boolean, // Whether it is allowed to clear the value
    inline: Boolean, // Whether the calendar should be shown inline
    // range: Boolean,
    // multiple: Boolean,
    timePicker: Boolean, // Whether to show the timePicker
  }

  connect() {
    if (!this.localeValue) {
      this.localeValue = navigator.language
    }

    if (!this.clearableValue) {
      this.clearButtonTarget.classList.add("hidden")
    }

    let today = new Date()
    if (this.hiddenInputTarget.value) {
      this.currentValue = new Date(Date.parse(this.hiddenInputTarget.value))
    } else {
      this.currentValue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0)
    }

    if (!this.inlineValue) {
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
    }

    this.boundClickedOutside = this.clickedOutside.bind(this)
    if (!this.inlineValue) {
      window.addEventListener("click", this.boundClickedOutside)
    }

    this.refreshCalendar()
  }

  disconnect() {
    window.removeEventListener("click", this.boundClickedOutside)
  }

  /**************
   *   ACTIONS  *
   **************/

  clear(event) {
    if (this.clearableValue) {
      this.currentValue = new Date()
      this.hiddenInputTarget.value = ""
      this.refreshCalendar()
      this.inputTarget.value = ""
    }
    event.preventDefault()
  }

  showCalendar(event) {
    this.calendarViewTarget.classList.remove("hidden")
    this.calendarViewTarget.setAttribute("data-show", "")
    if (!this.inlineValue) {
      this.popperInstance.update()
    }
  }

  hideCalendar(event) {
    this.calendarViewTarget.classList.add("hidden")
    this.calendarViewTarget.removeAttribute("data-show")
  }

  previousMonth(event) {
    this.currentValue = new Date(new Date(this.currentValue).setMonth(this.currentValue.getMonth() - 1))
    this.refreshCalendar()
  }

  nextMonth(event) {
    this.currentValue = new Date(new Date(this.currentValue).setMonth(this.currentValue.getMonth() + 1))
    this.refreshCalendar()
  }

  clickedOutside(event) {
    if (event.target.tagName == "svg" || event.target.tagName == "path") {
      return
    }
    if (!this.element.contains(event.target)) {
      this.hideCalendar(event)
    }
  }

  changeHours(event) {
    this.currentValue = new Date(new Date(this.currentValue).setHours(+event.target.value))
    this.refreshInput()
    event.preventDefault()
  }

  changeMinutes(event) {
    this.currentValue = new Date(new Date(this.currentValue).setMinutes(+event.target.value))
    this.refreshInput()
    event.preventDefault()
  }

  keyPress(event) {
    var code = event.keyCode || event.which
    if (code == 13) {
      event.preventDefault()
      event.cancelBubble = true
    }
  }

  selectDay(event) {
    this.currentValue = new Date(new Date(this.currentValue).setDate(+event.target.innerText))
    this.refreshCalendar()
  }

  /***********
   * HELPERS *
   ***********/

  refreshInput() {
    this.hiddenInputTarget.value = this.currentValue.toISOString()
    let format = this.formatValue
    if (!this.timePickerValue) {
      delete format["hour"]
      delete format["minute"]
    }
    this.inputTarget.value = Intl.DateTimeFormat(this.localeValue, format).format(this.currentValue)
  }

  refreshCalendar() {
    this.monthTarget.innerHTML = this.monthName
    this.yearTarget.innerHTML = this.currentValue.getFullYear()

    this.weekDaysTarget.innerHTML = ""
    this.getWeekDays(this.localeValue).forEach((dayName) => {
      this.weekDaysTarget.insertAdjacentHTML("beforeend", this.weekDayTemplateTarget.innerHTML.replace(/\${name}/g, dayName))
    })

    // Deal with AM/PM
    // new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

    if (this.hasHoursTarget) {
      this.hoursTarget.value = ("" + this.currentValue.getHours()).padStart(2, "0")
    }
    if (this.hasMinutesTarget) {
      this.minutesTarget.value = ("" + this.currentValue.getMinutes()).padStart(2, "0")
    }
    this.daysTarget.innerHTML = ""
    this.monthDays.forEach((day) => {
      if (day == " ") {
        this.daysTarget.insertAdjacentHTML("beforeend", this.emtpyTemplateTarget.innerHTML)
      } else {
        let date = new Date(new Date(this.currentValue).setDate(day))

        let tmpDiv = document.createElement("div")
        tmpDiv.innerHTML = this.dayTemplateTarget.innerHTML.replace(/\${day}/g, day)

        if (this.isToday(date)) {
          let div = tmpDiv.querySelector(".text-center")
          div.classList.add("border-red-500", "border")
        }
        if (this.isCurrent(date)) {
          let div = tmpDiv.querySelector(".text-center")
          div.classList.add("bg-blue-500", "text-white")
        }

        this.daysTarget.insertAdjacentHTML("beforeend", tmpDiv.innerHTML)
      }
    })

    this.refreshInput()
  }

  isToday(date) {
    const today = new Date()
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  }

  isCurrent(date) {
    return (
      this.hiddenInputTarget.value.length > 0 &&
      date.getDate() === this.currentValue.getDate() &&
      date.getMonth() === this.currentValue.getMonth() &&
      date.getFullYear() === this.currentValue.getFullYear()
    )
  }

  get monthName() {
    return new Date(this.currentValue).toLocaleString("default", { month: "long" })
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

    let monthStart = this.currentValue.getDay()
    if (this.weekStartValue == "sun") {
      monthStart = monthStart + 1
    }
    let monthEnd = new Date(new Date(new Date(this.currentValue).setMonth(this.currentValue.getMonth() + 1)).setDate(0)).getDate()

    for (let index = 0; index < monthStart; index++) {
      results.push(" ")
    }

    for (let index = 1; index <= monthEnd; index++) {
      results.push(index)
    }

    return results
  }
}
