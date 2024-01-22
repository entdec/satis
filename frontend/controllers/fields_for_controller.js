import ApplicationController from "./application_controller"

export default class extends ApplicationController {
  static targets = ["insertionPoint", "template"]

  connect() {
    super.connect()

    this.boundMonitorChanges = this.monitorChanges.bind(this)
    this.boundMouseMove = this.mouseMove.bind(this)

    this.addNewLine()
  }

  addAssociation(event) {
    event.preventDefault()

    // Find template and remove event listeners
    let templateElement = this.insertionPointTarget.querySelector(".template")
    templateElement.querySelectorAll("input,select").forEach((input) => {
      input.removeEventListener("change", this.boundMonitorChanges)
    })

    let tmpNode = event.target.closest(".nested-fields")

    this.setupNewChild(tmpNode)

    this.addNewLine()

    window.scrollBy(0, this.element.querySelector(".nested-fields").clientHeight)
  }

  setupNewChild(tmpNode) {
    tmpNode.classList.remove("template")
    tmpNode.querySelectorAll(".association").forEach((item) => {
      if (item.classList.contains("hidden")) {
        if (!item.querySelector("a[data-action='click->satis-fields-for#cloneAssociation']")) {
          item.classList.remove("hidden")
        }
      } else {
        if (!item.querySelector("a[data-action='click->satis-fields-for#cloneAssociation']")) {
          item.remove()
        } else {
          item.classList.add("hidden")
        }
      }
    })

    // Simply replace every child node's attributes value, replacing TEMPLATE
    let id = new Date().valueOf()
    tmpNode.querySelectorAll("*").forEach((node) => {
      for (let attribute of node.attributes) {
        attribute.value = attribute.value.replace(/TEMPLATE/g, id)
      }
    })

    tmpNode.querySelectorAll("template").forEach((node) => {
      node.innerHTML = node.innerHTML.replace(/TEMPLATE/g, id)
    })

    tmpNode.addEventListener("mousemove", this.boundMouseMove)
  }

  cloneAssociation(event) {
    event.preventDefault()

    let item = event.target.closest(".nested-fields")
    let templateId = item.querySelector("span.temp-id").getAttribute("temp_id")

    let clonedItem = item.cloneNode(true)

    clonedItem.querySelectorAll("*").forEach((node) => {
      for (let attribute of node.attributes) {
        attribute.value = attribute.value.replaceAll(templateId, "TEMPLATE")
      }
    })

    //this.insertionPointTarget.appendChild(clonedItem)
    this.insertionPointTarget.insertBefore(
      clonedItem,
      this.insertionPointTarget.childNodes[this.insertionPointTarget.childNodes.length - 1]
    )
    this.setupNewChild(clonedItem)
  }

  addNewLine() {
    this.insertionPointTarget.insertAdjacentHTML("beforeend", this.templateTarget.innerHTML)

    // Find template and add event listeners
    let templateElement = this.insertionPointTarget.querySelector(".template")
    templateElement.querySelectorAll("input,select").forEach((input) => {
      input.addEventListener("change", this.boundMonitorChanges)
    })
  }

  mouseMove(event) {
    let item = event.target.closest(".nested-fields")

    if (event.altKey) {
      item
        .querySelector("a[data-action='click->satis-fields-for#removeAssociation']")
        .parentElement.classList.add("hidden")
      item
        .querySelector("a[data-action='click->satis-fields-for#cloneAssociation']")
        .parentElement.classList.remove("hidden")
    } else {
      item
        .querySelector("a[data-action='click->satis-fields-for#removeAssociation']")
        .parentElement.classList.remove("hidden")
      item
        .querySelector("a[data-action='click->satis-fields-for#cloneAssociation']")
        .parentElement.classList.add("hidden")
    }
  }

  monitorChanges(event) {
    if (event?.detail?.src == "satis-dropdown") {
      // Skip events caused by the initial load of a satis-dropdown
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
