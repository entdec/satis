import ApplicationController from "../../../../frontend/controllers/application_controller"

/*
 * Tabs controller
 */
export default class extends ApplicationController {
  static targets = ["tab", "content", "select"]
  static values = { persist: Boolean, key: String }

  static keyBindings = [
    {
      keys: ["ctrl+1", "ctrl+2", "ctrl+3", "ctrl+4", "ctrl+5", "ctrl+6", "ctrl+7", "ctrl+8", "ctrl+9", "ctrl+0"],
      handler: (event, combo, controller) => {
        let index = -1 + +combo.split("+")[1]
        if (index == -1) {
          index = 10
        }
        controller.open(index)
      },
    },
  ]

  connect() {
    super.connect()

    let firstErrorIndex
    this.tabTargets.forEach((tab, index) => {
      let hasErrors = this.contentTargets[index].querySelectorAll(".is-invalid")
      if (hasErrors.length > 0) {
        if (!firstErrorIndex) {
          firstErrorIndex = index
        }
        tab.classList.add("is-invalid")
      }
    })

    if (this.keyValue) {
      fetch("/satis/user_data_tabs/" + this.keyValue, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              this.open(firstErrorIndex || data.index)
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      this.open(firstErrorIndex || 0)
    }
  }

  select(event) {
    let index = null
    if (event.srcElement.tagName == "SELECT") {
      index = event.srcElement.selectedIndex
    } else {
      let clickedTab = event.srcElement.closest("a")
      index = this.tabTargets.findIndex((el) => {
        return el.attributes["id"] === clickedTab.attributes["id"]
      })
    }
    this.open(index)

    if (this.keyValue) {
      fetch("/satis/user_data_tabs/" + index, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tab_index: index, data_key: this.keyValue }),
      })
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              //console.log(data)
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // Cancel the this event (dont show the browser context menu)
    event.preventDefault()
    return false
  }

  open(index) {
    if (index == -1 || this.tabTargets[index] === undefined) {
      return
    }

    this.tabTargets.forEach(function (target) {
      target.classList.remove("selected")
    })
    this.tabTargets[index].classList.add("selected")

    this.contentTargets.forEach(function (target) {
      target.classList.remove("selected")
    })
    this.contentTargets[index].classList.add("selected")
    this.selectTarget.selectedIndex = index
  }

  disconnect() {}
}
