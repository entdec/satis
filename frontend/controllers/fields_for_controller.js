import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["insertionPoint", "template"]

  connect() {
    let content = this.templateTarget.innerHTML
    this.insertionPointTarget.insertAdjacentHTML("beforebegin", content)
  }

  addAssociation(event) {
    event.preventDefault()

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

    this.insertionPointTarget.insertAdjacentHTML("beforebegin", this.templateTarget.innerHTML)
    window.scrollBy(0, this.element.querySelector(".nested-fields").clientHeight)
  }

  removeAssociation(event) {
    event.preventDefault()
    let item = event.target.closest(".nested-fields")
    item.querySelector("input[name*='_destroy']").value = 1
    item.style.display = "none"
  }
}
