import ApplicationController from "satis/controllers/application_controller"

export default class FieldsForController extends ApplicationController {
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

    tmpNode.querySelectorAll(":scope > .head > .association").forEach((item) => {
      if (item.classList.contains("hidden")) {
        if (!item.querySelector("a[data-action='click->satis-fields-for#cloneAssociation']")) {
          item.classList.remove("hidden")
        }
      } else {
        item.classList.add("hidden")
      }
    })

    // Simply replace every child node's attributes value, replacing TEMPLATE
    let templateId = new Date().valueOf()
    let templateName = tmpNode.querySelector("span.temp-name").getAttribute("temp_name")
    tmpNode.querySelector("span.temp-id").setAttribute("temp_id", templateId)
    tmpNode.querySelectorAll("*").forEach((node) => {
      for (let attribute of node.attributes) {
        attribute.value = attribute.value.replace(/TEMPLATE-NAME/g, `[${templateName}][${templateId}]`)
        attribute.value = attribute.value.replace(/TEMPLATE-ID/g, `${templateName}_${templateId}`)

        attribute.value = attribute.value.replace(/TEMPLATE/g, templateId)
      }
    })

    tmpNode.querySelectorAll("template").forEach((node) => {
      node.innerHTML = node.innerHTML.replace(/TEMPLATE-NANE/g, `[${templateName}][${templateId}]`)
      node.innerHTML = node.innerHTML.replace(/TEMPLATE-ID/g, `${templateName}_${templateId}`)

      node.innerHTML = node.innerHTML.replace(/TEMPLATE/g, templateId)
    })

    tmpNode.addEventListener("mousemove", this.boundMouseMove)
  }

  cloneAssociation(event) {
    event.preventDefault()

    let item = event.target.closest(".nested-fields")
    let templateId = item.querySelector("span.temp-id").getAttribute("temp_id")
    let templateName = item.querySelector("span.temp-name").getAttribute("temp_name")

    let clonedItem = item.cloneNode(true)

    clonedItem.querySelectorAll("*").forEach((node) => {
      for (let attribute of node.attributes) {
        attribute.value = attribute.value.replaceAll(`[${templateName}][${templateId}]`, "TEMPLATE-NAME")
        attribute.value = attribute.value.replaceAll(`${templateName}_${templateId}`, "TEMPLATE-ID")
      }
    })

    //this.insertionPointTarget.appendChild(clonedItem)
    this.insertionPointTarget.insertBefore(
        clonedItem,
        this.insertionPointTarget.childNodes[this.insertionPointTarget.childNodes.length - 1]
    )

    clonedItem
        .querySelector("a[data-action='click->satis-fields-for#removeAssociation']")
        ?.parentElement.classList.remove("hidden")
    clonedItem
        .querySelector("a[data-action='click->satis-fields-for#cloneAssociation']")
        ?.parentElement.classList.add("hidden")
    this.setupNewChild(clonedItem)
  }

  addNewLine() {
    this.insertionPointTarget.insertAdjacentHTML("beforeend", this.templateTarget.innerHTML)

    // Find template and add event listeners
    let templateElement = this.insertionPointTarget.querySelector(".template")
    setTimeout(() => {
      // add a delay so host can finish dom manipulation and everything is ready
      templateElement.querySelectorAll("input,select").forEach((input) => {
        input.addEventListener("change", this.boundMonitorChanges)
      })
    }, 500)
  }

  mouseMove(event) {
    let item = event.target.closest(".nested-fields")

    if (event.altKey) {
      item
          .querySelector("a[data-action='click->satis-fields-for#removeAssociation']")
          ?.parentElement.classList.add("hidden")
      item
          .querySelector("a[data-action='click->satis-fields-for#cloneAssociation']")
          ?.parentElement.classList.remove("hidden")
    } else {
      item
          .querySelector("a[data-action='click->satis-fields-for#removeAssociation']")
          ?.parentElement.classList.remove("hidden")
      item
          .querySelector("a[data-action='click->satis-fields-for#cloneAssociation']")
          ?.parentElement.classList.add("hidden")
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
