import { Controller } from "@hotwired/stimulus"
import { post } from "@rails/request.js"

export default class AttachmentUploadController extends Controller {
  static values = {
    url: String,
    parameterName: String
  }

  connect() {
    console.log("AttachmentUploadController#connect")
    this.createFileInput()
    this.addEventListeners()
  }

  createFileInput() {
    const input = document.createElement("input")
    input.setAttribute("name", `${this.parameterNameValue}[]`)
    input.setAttribute("type", "file")
    input.setAttribute("multiple", "multiple")
    input.style.display = "none"
    this.element.appendChild(input)
    this.fileInput = input
  }

  addEventListeners() {
    this.fileInput.addEventListener("change", this.handleChange.bind(this))
    this.element.addEventListener("dragover", this.handleDragOver.bind(this))
    this.element.addEventListener("dragleave", this.handleDragLeave.bind(this))
    this.element.addEventListener("dragenter", this.handleDragEnter.bind(this))
    this.element.addEventListener("drop", this.handleDrop.bind(this))
  }

  handleClick(event) {
    console.log("AttachmentUploadController#handleClick")
    this.fileInput.click()
  }

  handleChange(event) {
    this.upload(event.target.files)
  }

  handleDragOver(event) {
    event.preventDefault()
    this.element.classList.add("dragging")
  }

  handleDragLeave(event) {
    event.preventDefault()
    this.element.classList.remove("dragging")
  }

  handleDragEnter(event) {
    event.preventDefault()
    this.element.classList.add("dragging")
  }

  handleDrop(event) {
    event.preventDefault()
    this.element.classList.remove("dragging")
    if (event.dataTransfer.files.length > 0) {
      this.upload(event.dataTransfer.files)
    }
  }

  upload(files) {
    // Only proceed if files are selected
    if (files.length === 0) return

    let formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      formData.append(`${this.parameterNameValue}[]`, files[i])
    }

    this.element.classList.add("uploading")

    post(this.urlValue, {
      body: formData,
      responseKind: 'turbo-stream'
    }).then(html => {
      this.element.classList.remove("uploading")
    })
  }
}
