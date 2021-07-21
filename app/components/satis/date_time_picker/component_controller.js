import ApplicationController from "../../../../frontend/controllers/application_controller"

export default class extends ApplicationController {
  static targets = ["hours", "minutes", "month", "year", "days", "emtpyTemplate", "dayTemplate"]

  connect() {
    this.days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    let today = new Date()

    this.currentDate = today

    this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString()

    this.display()
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

  // Gets the list of days
  get monthDays() {
    let results = []

    let monthStart = this.currentDate.getDay()
    let monthEnd = new Date(new Date(new Date(this.currentDate).setMonth(this.currentDate.getMonth() + 1)).setDate(0)).getDate()

    for (let index = 0; index < monthStart; index++) {
      results.push(" ")
    }

    for (let index = 1; index <= monthEnd; index++) {
      results.push(index)
    }

    return results
  }
}
