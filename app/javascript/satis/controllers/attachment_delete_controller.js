import { Controller } from "@hotwired/stimulus"
import AttachmentUploadController from "./attachment_upload_controller";
import { get } from '@rails/request.js'

/***
 * Delete attachments controller
 *
 * Deletes an attachments
 */
export default class AttachmentDeleteController extends Controller {
  connect() {}

  delete(event) {
    const self = this

    event.stopPropagation()
    event.preventDefault()

    const formData = new FormData()
    formData.append("_method", "DELETE")

    fetch(self.element.getAttribute("href"), {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector("meta[name=csrf-token]").content,
      },
      body: formData,
    })
      .then(self.handleErrors)
      .then((response) => {
        window.location.reload(true);
        response.json().then(function (data) {
          let node = document.querySelector(data.selector)
          if (node) {
            node.innerHTML = data.html
          }
        })
      })
      .catch((error) => {
        console.log(error)
      })
    return false
  }

  handleErrors(response) {
    if (!response.ok) throw new Error(response.status)
    return response
  }
}
