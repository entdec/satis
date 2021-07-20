import { definitionsFromContext } from "stimulus/webpack-helpers"
import { Application } from "stimulus"

import "@fortawesome/fontawesome-pro/js/all"
import { config, library, dom } from "@fortawesome/fontawesome-svg-core"
config.mutateApproach = "sync"
dom.watch()

export class Satis {
  static start(application) {
    if (!application) {
      application = Application.start()
    }

    console.log("Satis")

    this.application = application
    const context = require.context("./controllers", true, /\.js$/)
    const componentContext = require.context("../app/components/", true, /component_controller\.js$/)

    context
      .keys()
      .map((key) => {
        const [_, name] = /([a-z\_]+)_controller\.js$/.exec(key)
        return [name, context(key).default]
      })
      .filter(([name, controller]) => {
        return name != "application"
      })
      .forEach(([name, controller]) => {
        this.application.register(`satis-${name.replace(/_/g, "-")}`, controller)
      })

    componentContext
      .keys()
      .map((key) => {
        // Take the last part (before component_controller) of the path as the name
        const [_, name] = /([^/]+)\/component_controller\.js$/.exec(key)
        return [name, componentContext(key).default]
      })
      .forEach(([name, controller]) => {
        this.application.register(`satis-${name.replace(/_/g, "-")}`, controller)
      })

    this.application.load(definitionsFromContext(context).concat(definitionsFromContext(componentContext)))

    // Start of keyboard shortcuts
    document.addEventListener("mousemove", (event) => {
      this.mouseElement = event.target
    })

    Mousetrap.bind(["ctrl+1", "ctrl+2", "ctrl+3", "ctrl+4", "ctrl+5", "ctrl+6", "ctrl+7", "ctrl+8", "ctrl+9", "ctrl+0"], (event, combo) => {
      if (this.mouseElement) {
        let elm = this.mouseElement.closest('[data-controller="satis-tabs"]')
        if (elm) {
          let controller = elm["satis-tabs"]
          let index = -1 + +combo.split("+")[1]
          if (index == -1) {
            index = 10
          }
          controller.open(index)
        }
      }
    })
  }
}
