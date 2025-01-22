import { Controller } from "@hotwired/stimulus"
import { post } from "@rails/request.js"

export default class AttachmentUploadController extends Controller {
  connect() {
    console.log("AttachmentUploadController#connect")
    this.createFileInput()
    this.addEventListeners()
  }

  createFileInput() {
    const input = document.createElement("input")
    input.setAttribute("name", "attachments[]")
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
    event.preventDefault()
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
      formData.append("attachments[]", files[i])
    }

    this.element.classList.add("uploading")

    post(this.data.get("url"), {
      body: formData,
      redirect: 'follow', // Important: follow redirects
      returnKind: 'turbo-stream'
    }).then((html) => {
      Turbo.renderStreamMessage(html)
      this.element.classList.remove("uploading")
    }).catch((error) => {
      console.log(error)
      this.element.classList.remove("uploading")
    })
  }
}
