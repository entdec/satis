import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["insertionPoint", "template"]

  connect() {
    console.log("fields-for")

    let content = this.templateTarget.innerHTML //.replace(/TEMPLATE/g, new Date().valueOf())
    this.insertionPointTarget.insertAdjacentHTML("beforebegin", content)
  }

  addAssociation(event) {
    event.preventDefault()

    let tmpNode = event.target.closest(".nested-fields")
    tmpNode.querySelectorAll(".col-span-1").forEach((item) => {
      if (item.classList.contains("hidden")) {
        item.classList.remove("hidden")
      } else {
        item.remove()
      }
    })
    tmpNode.innerHTML = tmpNode.innerHTML.replace(/TEMPLATE/g, new Date().valueOf())

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
