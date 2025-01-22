import { Controller } from "@hotwired/stimulus"
import { post } from "@rails/request.js"

export default class AttachmentUploadController extends Controller {
  static targets = ["button"]

  static values = {
    url: String,
    parameterName: String
  }

  connect() {
    this.createFileInput()
    this.addEventListeners()
  }

  disconnect() {
    this.fileInput.removeEventListener("change", this.handleChange.bind(this))
    this.element.removeEventListener("dragover", this.handleDragOver.bind(this))
    this.element.removeEventListener("dragleave", this.handleDragLeave.bind(this))
    this.element.removeEventListener("dragenter", this.handleDragEnter.bind(this))
    this.element.removeEventListener("drop", this.handleDrop.bind(this))
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
    this.fileInput.click()
  }

  handleChange(event) {
    if (this.hasUrlValue) {
      this.upload(event.target.files)
    } else {
      this.buttonTarget.innerHTML = `${event.target.files.length} files selected`
    }
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
      if (this.hasUrlValue) {
        this.upload(event.dataTransfer.files)
      } else {
        this.buttonTarget.innerHTML = `${event.dataTransfer.files.length} files selected`
      }
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
