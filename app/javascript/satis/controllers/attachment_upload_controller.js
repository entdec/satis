import { Controller } from "@hotwired/stimulus"

export default class AttachmentUploadController extends Controller {
  static targets = ["input"]

  connect() {
    this.createFileInput()
    this.addEventListeners()
  }

  createFileInput() {
    const input = document.createElement("input")
    input.setAttribute("name", this.data.get("param-name") || "file")
    input.setAttribute("type", "file")
    input.setAttribute("multiple", "multiple")
    input.style.display = "none"
    this.element.appendChild(input)
    this.fileInput = input

    if (!this.data.has("param-name")) {
      console.warn(this.element, "has no data-upload-param attribute, uploads may not work")
    }
  }

  addEventListeners() {
    this.element.addEventListener("click", this.handleClick.bind(this))
    this.fileInput.addEventListener("change", this.handleChange.bind(this))
    this.element.addEventListener("dragover", this.handleDragOver.bind(this))
    this.element.addEventListener("dragleave", this.handleDragLeave.bind(this))
    this.element.addEventListener("dragenter", this.handleDragEnter.bind(this))
    this.element.addEventListener("drop", this.handleDrop.bind(this))
  }

  handleClick(event) {
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
    if (this.data.has("extra-data")) {
      for (let [key, value] of Object.entries(JSON.parse(this.data.get("extra-data")))) {
        formData.append(key, value)
      }
    }

    for (let i = 0; i < files.length; i++) {
      formData.append(this.data.get("param-name"), files[i])
    }

    this.element.classList.add("uploading")

    fetch(this.data.get("url"), {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        'Accept': 'text/html, application/json'
      },
      redirect: 'follow'  // Important: follow redirects
    }).then((response) => {
      // Check if the response is a redirect
      if (response.type === 'opaqueredirect' || response.redirected) {
        window.location.href = response.url
        return
      }

      if (response.ok) {
        this.element.classList.remove("uploading")
        window.location.reload(true)
      } else {
        throw new Error(response.statusText)
      }
    }).catch((error) => {
      console.log(error)
      this.element.classList.remove("uploading")
    })
  }
}
