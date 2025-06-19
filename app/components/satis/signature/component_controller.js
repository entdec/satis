import ApplicationController from "satis/controllers/application_controller"

import SignaturePad from "signature_pad"

export default class SignatureComponentController extends ApplicationController {
  static targets = ["canvas", "file"]
  static values = { url: String }

  async connect() {
    this.signaturePad = new SignaturePad(this.canvasTarget)
    if (this.hasUrlValue) {
      let blob = await fetch(this.urlValue, { cache: "no-store" })
        .then(r => r.blob())

      let dataUrl = await new Promise(resolve => {
        let reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
      const dpi = window.devicePixelRatio
      window.devicePixelRatio = 1
      this.signaturePad.fromDataURL(dataUrl)
      const file = this.dataURLtoFile(dataUrl, "signature.svg")
      window.devicePixelRatio = dpi
      this.signaturePad.addEventListener("beginStroke", this.clear.bind(this), { once: true })
      this.persistFile(file)
    }
    this.signaturePad.addEventListener("endStroke", this.persist.bind(this))
  }

  clear(event) {
    this.signaturePad.clear()
    this.fileTarget.files = new DataTransfer().files
  }

  undo(event) {
    event.preventDefault()
    const data = this.signaturePad.toData()
    if (data) {
      data.pop()
      this.signaturePad.fromData(data)
    }
  }

  persist(event) {
    const dpi = window.devicePixelRatio
    const dataUrl = this.signaturePad.toSVG()
    window.devicePixelRatio = 1
    const file = new File([this.signaturePad?.toSVG()], "signature.svg", { type: "image/svg+xml" })
    window.devicePixelRatio = dpi
    this.persistFile(file)
  }

  persistFile(file) {
    const dt = new DataTransfer()
    dt.items.add(file)
    this.fileTarget.files = dt.files
  }

  // HELPER

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}