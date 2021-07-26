import tippy from "tippy.js"
import "tippy.js/dist/tippy.css" // optional for styling

export default class SatisCopyable extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: "open" })

    this.textSpan = document.createElement("span")
    this.textSpan.textContent = this.textContent
    shadow.appendChild(this.textSpan)

    this.tippy = tippy(this.textSpan, { content: "Click to copy" })

    this.input = document.createElement("input")
    this.input.style.position = "fixed"
    this.input.style.top = 0
    this.input.style.left = 0
    this.input.style.width = "1px"
    this.input.style.height = "1px"
    this.input.style.padding = 0
    this.input.style.border = "none"
    this.input.style.outline = "none"
    this.input.style.boxShadow = "none"
    this.input.style.background = "transparent"
    this.input.value = this.textSpan.textContent

    shadow.appendChild(this.input)

    this.textSpan.addEventListener("click", this.copy.bind(this))
  }

  copy(event) {
    this.input.select()

    try {
      var successful = document.execCommand("copy")
      var msg = successful ? "Copied!" : "Not copied"
      this.tippy.setContent(msg)
      this.tippy.show()
    } catch (err) {
      this.tippy.setContent("Oops, unable to copy")
      this.tippy.show()
    }

    setTimeout(() => {
      // this.tippy.hide()
      this.tippy.setContent("Click to copy")
    }, 500)

    window.getSelection().removeAllRanges()
  }
}
