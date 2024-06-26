import ApplicationController from "satis/controllers/application_controller"
import { createPopper } from "@popperjs/core"
import { debounce } from "satis/utils"

export default class DateTimePickerComponentController extends ApplicationController {
  static targets = [
    "input",
    "hiddenInput",
    "clearButton",
    "hours",
    "minutes",
    "month",
    "year",
    "days",
    "weekDays",
    "calendarView",
    "weekDayTemplate",
    "emtpyTemplate",
    "dayTemplate",
  ]
  static values = {
    locale: String, // Which locale should be used, if nothing entered, browser locale is used
    weekStart: Number, // On which day do we start the week, sunday - saturday : 0 - 6
    format: Object, // JSON date-format - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    clearable: Boolean, // Whether it is allowed to clear the value
    inline: Boolean, // Whether the calendar should be shown inline
    timePicker: Boolean, // Whether to show the timePicker
    range: Boolean, // whether we allow to select a range of dates
    multiple: Boolean, // whether we allow to select multiple dates
    // visibleMonths: Number, // TODO: whether we show more than one calendar view
  }

  connect() {
    super.connect()

    if (!this.localeValue) {
      this.localeValue = navigator.language
    }

    if (!this.clearableValue) {
      this.clearButtonTarget.classList.add("hidden")
    }

    if (this.timePickerValue) {
      this.rangeValue = false
      this.multipleValue = false
    }

    this.prepareSelection()

    if (!this.inlineValue) {
      this.popperInstance = createPopper(this.element, this.calendarViewTarget, {
        offset: [-20, 2],
        placement: "bottom-start",
        modifiers: [
          {
            name: "flip",
            enabled: true,
            options: {
              boundary: this.element.closest(".sts-card"),
            },
          },
          {
            name: "preventOverflow",
            enabled: true,
          },
        ],
      })
      this.popperInstance.state.elements.popper.popperInstance = () => this.popperInstance
    }

    this.boundClickedOutside = this.clickedOutside.bind(this)
    if (!this.inlineValue) {
      window.addEventListener("click", this.boundClickedOutside)
    }

    this.boundKeyUp = this.keyUp.bind(this)
    window.addEventListener("keyup", this.boundKeyUp)

    let input = this.inputTarget
    this.hiddenInputTarget.addEventListener("focus", function (event) {
      input.focus()
    })

    // we set the calendar data and update the visual layout
    if (this.hiddenInputTarget.value) {
      // flag true indicates we are also updating/refreshing the input field data
      this.refreshCalendar(true)
    } else {
      this.refreshCalendar(false)
    }
  }

  prepareSelection() {
    this.selectedValue = []
    let startDate = new Date()
    if (this.hiddenInputTarget.value) {
      this.hiddenInputTarget.value.split(/;| - |\s/).forEach((value) => {
        this.selectedValue.push(new Date(Date.parse(value)))
      })
    }

    if (this.selectedValue.length == 0) {
      this.selectedValue.push(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
          0
        )
      )
    }

    this.displayValue = new Date(this.selectedValue[0].getFullYear(), this.selectedValue[0].getMonth(), 1)
    this.currentSelectNr = this.selectedValue.length
  }

  disconnect() {
    window.removeEventListener("click", this.boundClickedOutside)
    window.removeEventListener("keyup", this.boundKeyUp)
  }

  /**************
   *   ACTIONS  *
   **************/

  clear(event) {
    if (this.clearableValue) {
      this.selectedValue = []

      this.currentSelectNr = 1

      let today = new Date()
      this.displayValue = new Date(today.getFullYear(), today.getMonth(), 1)
      this.hiddenInputTarget.value = ""
      this.inputTarget.value = ""
      this.hiddenInputTarget.dispatchEvent(new CustomEvent("change", { detail: { src: "satis-date-time-picker" } }))
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
    this.displayValue = new Date(new Date(this.displayValue).setMonth(this.displayValue.getMonth() - 1))
    this.refreshCalendar(false)
  }

  nextMonth(event) {
    this.displayValue = new Date(new Date(this.displayValue).setMonth(this.displayValue.getMonth() + 1))
    this.refreshCalendar(false)
  }

  previousYear(event) {
    this.displayValue = new Date(new Date(this.displayValue).setFullYear(this.displayValue.getFullYear() - 1));
    this.refreshCalendar(false);
  }

  nextYear(event) {
    this.displayValue = new Date(new Date(this.displayValue).setFullYear(this.displayValue.getFullYear() + 1));
    this.refreshCalendar(false);
  }

  clickedOutside(event) {
    if (event.target.tagName == "svg" || event.target.tagName == "path") {
      return
    }

    let isInside = false
    let controllerEl = event.target.closest('[data-controller="satis-date-time-picker"]')
    if (controllerEl) {
      isInside = controllerEl["satis-date-time-picker"] == this
    }

    if (!isInside) {
      this.hideCalendar(event)
    }

    event.cancelBubble = true
  }

  keyUp(event) {
    if (event.key == "Tab") {
      let controllerEl = document.activeElement.closest('[data-controller="satis-date-time-picker"]')
      if (controllerEl) {
        if (controllerEl["satis-date-time-picker"] != this) {
          this.hideCalendar(event)
        }
      } else {
        this.hideCalendar(event)
      }

      event.cancelBubble = true
    }
  }

  changeHours(event) {
    let newHours = 0

    if (event.target.value.length < 2) {
      return
    } else {
      newHours = Number.parseInt(event.target.value)

      if (newHours > 23) {
        newHours = 0
      }
    }

    this.selectedValue[0] = new Date(new Date(this.selectedValue[0]).setHours(newHours))
    this.refreshInputs()
    event.preventDefault()
  }

  changeMinutes(event) {
    let newMinutes = 0

    if (event.target.value.length < 2) {
      return
    } else {
      newMinutes = Number.parseInt(event.target.value)

      if (newMinutes > 59) {
        newMinutes = 0
      }
    }

    this.selectedValue[0] = new Date(new Date(this.selectedValue[0]).setMinutes(newMinutes))
    this.refreshInputs()
    event.preventDefault()
  }

  keyPress(event) {
    switch (event.key) {
      case "Escape":
        this.hideCalendar(event)
        break
      case "Enter":
        event.preventDefault()
        event.cancelBubble = true
        break
      default:
        break
    }
  }

  hiddenInputChanged(event) {
    this.prepareSelection()
    this.refreshCalendar(false)
    if (event?.detail?.src !== "satis-date-time-picker") {
      this.refreshInputs(false)
    }
  }

  dateTimeEntered(event) {
    // FIXME: This doesn't work properly yet
    // let newValue
    // try {
    //   newValue = new Date(this.inputTarget.value)
    // } catch (error) {}
    // if (!isNaN(newValue.getTime())) {
    //   this.selectedValue = [newValue]
    //   this.refreshCalendar()
    // }
  }

  selectDay(event) {
    let oldCurrentValue = this.selectedValue[0]
    if (!this.rangeValue && !this.multipleValue) {
      this.selectedValue[0] = new Date(new Date(this.displayValue).setDate(+event.target.innerText))
      if (this.timePickerValue && oldCurrentValue) {
        this.selectedValue[0].setHours(oldCurrentValue.getHours())
        this.selectedValue[0].setMinutes(oldCurrentValue.getMinutes())
      }
      this.currentSelectNr = 1
    } else if (this.rangeValue) {
      if (this.currentSelectNr == 1) {
        this.selectedValue = []
      }
      this.selectedValue[this.currentSelectNr - 1] = new Date(
        new Date(this.displayValue).setDate(+event.target.innerText)
      )
      this.currentSelectNr += 1
      if (this.currentSelectNr > 2) {
        this.currentSelectNr = 1
      }
    } else if (this.multipleValue) {
      this.selectedValue[this.currentSelectNr - 1] = new Date(
        new Date(this.displayValue).setDate(+event.target.innerText)
      )
      this.currentSelectNr += 1
    }

    this.refreshCalendar()

    if (!this.rangeValue || this.selectedValue.length == 2) {
      this.hideCalendar()
    }

    event.cancelBubble = true
  }

  /***********
   * HELPERS *
   ***********/

  get maxSelectNr() {
    let result = 1
    if (this.rangeValue) {
      result = 2
    } else if (this.multipleValue) {
      result = 0
    }
    return result
  }

  // Refreshes the hidden and visible input values
  refreshInputs(dispatchEvent = true) {
    let joinChar = ";"
    if (this.rangeValue) {
      joinChar = " - "
    } else if (this.multipleValue) {
      joinChar = ";"
    }

    let inputValue = this.selectedValue
      .map((val) => {
        return this.iso8601(val)
      })
      .join(joinChar)

    if (inputValue.split(joinChar).length >= this.maxSelectNr) {
      this.hiddenInputTarget.value = inputValue
      if (dispatchEvent) {
        this.hiddenInputTarget.dispatchEvent(new Event("change"))
      }
    }

    let format = this.formatValue
    if (!this.timePickerValue) {
      delete format["hour"]
      delete format["minute"]
    }

    this.inputTarget.value = this.selectedValue
      .map((val) => {
        return Intl.DateTimeFormat(this.localeValue, format).format(val)
      })
      .join(joinChar)
  }

  // Refreshes the calendar
  refreshCalendar(refreshInputs) {
    this.monthTarget.innerHTML = this.monthName
    this.yearTarget.innerHTML = this.displayValue.getFullYear()

    this.weekDaysTarget.innerHTML = ""
    this.getWeekDays(this.localeValue).forEach((dayName) => {
      this.weekDaysTarget.insertAdjacentHTML(
        "beforeend",
        this.weekDayTemplateTarget.innerHTML.replace(/\${name}/g, dayName)
      )
    })

    // Deal with AM/PM
    // new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

    if (this.hasHoursTarget) {
      if (this.selectedValue[0]) {
        this.hoursTarget.value = ("" + this.selectedValue[0].getHours()).padStart(2, "0")
      } else {
        this.hoursTarget.value = "0" // FIXME: Should be 0:00 in locale
      }
    }
    if (this.hasMinutesTarget) {
      if (this.selectedValue[0]) {
        this.minutesTarget.value = ("" + this.selectedValue[0].getMinutes()).padStart(2, "0")
      } else {
        this.minutesTarget.value = "00" // FIXME: Should be 0:00 in locale
      }
    }
    this.daysTarget.innerHTML = ""

    this.monthDays.forEach((day) => {
      if (day == " ") {
        this.daysTarget.insertAdjacentHTML("beforeend", this.emtpyTemplateTarget.innerHTML)
      } else {
        let date = new Date(new Date(this.displayValue).setDate(day))

        let tmpDiv = document.createElement("div")
        tmpDiv.innerHTML = this.dayTemplateTarget.innerHTML.replace(/\${day}/g, day)

        if (this.isToday(date)) {
          let div = tmpDiv.querySelector(".text-center")
          div.classList.add("border-red-500", "border")
        }
        let div = tmpDiv.querySelector(".text-center")

        if (this.isSelected(date)) {
          if (this.rangeValue && this.selectedValue.length == 2) {
            if (this.isDate(this.selectedValue[0], date)) {
              div.classList.add("bg-primary-500", "text-white", "dark:text-gray-200")
              div.classList.remove("rounded-r-full")
            } else if (this.isDate(this.selectedValue[1], date)) {
              div.classList.add("bg-primary-500", "text-white", "dark:text-gray-200")
              div.classList.remove("rounded-l-full")
            } else if (this.isSelected(date)) {
              div.classList.remove("rounded-r-full")
              div.classList.remove("rounded-l-full")
              div.classList.add("bg-primary-200", "text-white", "dark:text-gray-200")
            }
          } else {
            div.classList.add("bg-primary-500", "text-white", "dark:text-gray-200")
          }
        } else {
          div.classList.add("text-gray-700", "dark:text-gray-300")
        }

        this.daysTarget.insertAdjacentHTML("beforeend", tmpDiv.innerHTML)
        tmpDiv.remove()
      }
    })

    if (refreshInputs != false) {
      if (this.rangeValue && this.selectedValue.length == 2) {
        this.refreshInputs()
      } else {
        this.refreshInputs(false)
      }
    }
  }

  // Format the given Date into an ISO8601 string whilst preserving the given timezone
  iso8601(date) {
    let tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? "+" : "-",
      pad = function (num) {
        let norm = Math.floor(Math.abs(num))
        return (norm < 10 ? "0" : "") + norm
      }

    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ":" +
      pad(tzo % 60)
    )
  }

  // Is date today?
  isToday(date) {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  isDate(today, date) {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Is date the currently selected value
  isSelected(date) {
    if (this.rangeValue && this.selectedValue.length == 2) {
      return date >= this.selectedValue[0] && date <= this.selectedValue[1]
    } else {
      return this.selectedValue.some((selDate) => {
        return (
          date.getDate() === selDate.getDate() &&
          date.getMonth() === selDate.getMonth() &&
          date.getFullYear() === selDate.getFullYear()
        )
      })
    }
  }

  // Get name of month for current value
  get monthName() {
    let result = new Date(this.displayValue).toLocaleString(this.localeValue, {
      month: "long",
    })
    result = result[0].toUpperCase() + result.substring(1)
    return result
  }

  // Gets the names of week days
  getWeekDays(locale) {
    const baseDate = new Date(2021, 1, this.weekStartValue) // 1 Feb 2021 is a monday
    let weekDays = []
    for (let i = 0; i < 7; i++) {
      let weekDay = baseDate.toLocaleDateString(locale, { weekday: "short" })
      weekDays.push(weekDay)
      baseDate.setDate(baseDate.getDate() + 1)
    }
    return weekDays
  }

  // Gets the list of days to display
  get monthDays() {
    let results = []

    // Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
    let dayOfFirstOfMonth = new Date(new Date(this.displayValue).setDate(0)).getDay() + 1 - this.weekStartValue
    let monthStart = dayOfFirstOfMonth
    if (dayOfFirstOfMonth < 0) {
      monthStart += 7
    }

    let monthEnd = new Date(
      new Date(new Date(this.displayValue).setMonth(this.displayValue.getMonth() + 1)).setDate(0)
    ).getDate()

    for (let index = 0; index < monthStart; index++) {
      results.push(" ")
    }

    for (let index = 1; index <= monthEnd; index++) {
      results.push(index)
    }

    return results
  }
}
