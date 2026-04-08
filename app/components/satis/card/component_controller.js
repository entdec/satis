import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["body", "collapseIcon", "actions", "footer"]
  static values = {
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false },
    identifier: String
  }

  connect() {
    if (this.collapsibleValue) {
      this._restoreState()
      this._applyState(false)
    }
  }

  toggle(event) {
    if (!this.collapsibleValue) return

    // Don't toggle when clicking on actions, buttons, links, or menus inside the header
    if (event.target.closest('a, button:not([data-satis-card-target="collapseIcon"]), .sts-menu, [data-action]')) {
      if (!event.target.closest('[data-satis-card-target="collapseIcon"]')) return
    }

    this.collapsedValue = !this.collapsedValue
    this._applyState(true)
    this._saveState()
  }

  _applyState(animate) {
    const collapsed = this.collapsedValue

    if (this.hasBodyTarget) {
      if (animate) {
        this.bodyTarget.style.transition = "max-height 0.2s ease-in-out, opacity 0.2s ease-in-out"
      }

      if (collapsed) {
        this.bodyTarget.style.maxHeight = "0px"
        this.bodyTarget.style.opacity = "0"
        this.bodyTarget.style.overflow = "hidden"
      } else {
        this.bodyTarget.style.maxHeight = ""
        this.bodyTarget.style.opacity = ""
        this.bodyTarget.style.overflow = ""
      }
    }

    if (this.hasFooterTarget) {
      this.footerTarget.style.display = collapsed ? "none" : ""
    }

    // Actions stay visible when collapsed — they're in the header
    if (this.hasCollapseIconTarget) {
      this.collapseIconTarget.style.transform = collapsed ? "rotate(-90deg)" : "rotate(0deg)"
    }
  }

  _storageKey() {
    return `satis-card-${this.identifierValue}-collapsed`
  }

  _saveState() {
    if (this.identifierValue) {
      sessionStorage.setItem(this._storageKey(), this.collapsedValue)
    }
  }

  _restoreState() {
    if (this.identifierValue) {
      const stored = sessionStorage.getItem(this._storageKey())
      if (stored !== null) {
        this.collapsedValue = stored === "true"
      }
    }
  }
}
