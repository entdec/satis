import ApplicationController from "satis/controllers/application_controller"

export default class FieldsForController extends ApplicationController {
  static targets = ["insertionPoint", "template"]

  connect() {
    super.connect()
    this.boundMonitorChanges = this.monitorChanges.bind(this)
    this.addNewLine()
  }

  addAssociation(event) {
    event.preventDefault()

    // Find template and remove event listeners
    let templateElement = this.insertionPointTarget.querySelector(".template")
    templateElement.querySelectorAll("input, select").forEach((input) => {
      input.removeEventListener("change", this.boundMonitorChanges)
    })

    let tmpNode = event.target.closest(".nested-fields")
    tmpNode.classList.remove("template")
    tmpNode.querySelectorAll(".association").forEach((item) => {
      if (item.querySelector(".fa-plus")) {
        item.classList.add("hidden")
      } else if (item.querySelector(".fa-trash")) {
        item.classList.remove("hidden")
      }
    })

    // Replace TEMPLATE placeholders with a unique id
    let id = new Date().valueOf()
    tmpNode.querySelectorAll("*").forEach((node) => {
      for (let attribute of node.attributes) {
        attribute.value = attribute.value.replace(/TEMPLATE/g, id)
      }
    })

    this.addNewLine()

    window.scrollBy(0, this.element.querySelector(".nested-fields").clientHeight)
  }

  addNewLine() {
    this.insertionPointTarget.insertAdjacentHTML("beforeend", this.templateTarget.innerHTML)

    // Find template and add event listeners
    let templateElement = this.insertionPointTarget.querySelector(".template")
    setTimeout(() => {
      templateElement.querySelectorAll("input, select").forEach((input) => {
        input.addEventListener("change", this.boundMonitorChanges)
      })
    }, 500)
  }

  monitorChanges(event) {
    if (event?.detail?.src === "satis-dropdown") {
      return
    }

    this.addAssociation(event)
  }

  removeAssociation(event) {
    event.preventDefault()
    let item = event.target.closest(".nested-fields")
    item.querySelector("input[name*='_destroy']").value = 1
    item.style.display = "none"
  }
}
