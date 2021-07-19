import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["insertionPoint", "template"]

  connect() {
    this.boundMonitorChanges = this.monitorChanges.bind(this)
    this.addNewLine()
  }

  addAssociation(event) {
    event.preventDefault()

    // Find template and remove event listeners
    let templateElement = this.insertionPointTarget.querySelector(".template")
    templateElement.querySelectorAll("input").forEach((input) => {
      input.removeEventListener("change", this.boundMonitorChanges)
    })

    let tmpNode = event.target.closest(".nested-fields")
    tmpNode.classList.remove("template")
    tmpNode.querySelectorAll(".association").forEach((item) => {
      if (item.classList.contains("hidden")) {
        item.classList.remove("hidden")
      } else {
        item.remove()
      }
    })

    // Simply replace every child node's attributes value, replacing TEMPLATE
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
    templateElement.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", this.boundMonitorChanges)
    })
  }

  monitorChanges(event) {
    console.log("CHANGE!!!!")
    this.addAssociation(event)
  }

  removeAssociation(event) {
    event.preventDefault()
    let item = event.target.closest(".nested-fields")
    item.querySelector("input[name*='_destroy']").value = 1
    item.style.display = "none"
  }
}
