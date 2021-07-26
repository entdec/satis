import { definitionsFromContext } from "stimulus/webpack-helpers"
import { Application } from "stimulus"

import Mousetrap from "mousetrap"

import "@fortawesome/fontawesome-pro/js/all"
import { config, library, dom } from "@fortawesome/fontawesome-svg-core"
config.mutateApproach = "sync"
dom.watch()

export class Satis {
  static start(application, configuration = {}) {
    if (!application) {
      application = Application.start()
    }

    this.application = application
    this.application.satis = {
      mouseElement: null,
      configuration: configuration,
    }

    console.log("Satis")

    const utilityContext = require.context("./utility_controllers", true, /\.js$/)
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
        let identifier = `satis-${name.replace(/_/g, "-")}`
        this.application.register(identifier, controller)
      })

    componentContext
      .keys()
      .map((key) => {
        // Take the last part (before component_controller) of the path as the name
        const [_, name] = /([^/]+)\/component_controller\.js$/.exec(key)
        return [name, componentContext(key).default]
      })
      .forEach(([name, controller]) => {
        let identifier = `satis-${name.replace(/_/g, "-")}`
        if (controller.keyBindings) {
          controller.keyBindings.forEach((keyBinding) => {
            Satis.registerKeybinding(identifier, keyBinding.keys, keyBinding.handler)
          })
        }
        this.application.register(identifier, controller)
      })

    this.application.load(definitionsFromContext(context).concat(definitionsFromContext(componentContext)))

    if (configuration.utilityControllers != false) {
      utilityContext
        .keys()
        .map((key) => {
          const [_, name] = /([a-z\_]+)_controller\.js$/.exec(key)
          return [name, utilityContext(key).default]
        })
        .forEach(([name, controller]) => {
          this.application.register(name.replace(/_/g, "-"), controller)
        })
    } else {
      console.log("Not loading Utility controllers")
    }

    // Start of keyboard shortcuts
    document.addEventListener("mouseover", (event) => {
      this.application.satis.mouseElement = event.target
    })

    // Load custom elements
    Satis.loadCustomElements()
  }

  static registerKeybinding(identifier, keys, handler) {
    Mousetrap.bind(keys, (event, combo) => {
      if (this.application.satis.mouseElement) {
        let elm = this.application.satis.mouseElement.closest(`[data-controller="${identifier}"]`)
        if (elm) {
          handler(event, combo, elm[identifier])
        }
      }
    })
  }

  static loadCustomElements() {
    const elementsContext = require.context("./elements", true, /\.js$/)
    elementsContext
      .keys()
      .map((key) => {
        const [_, name] = /([a-z\_]+)_element\.js$/.exec(key)
        return [name, elementsContext(key).default]
      })
      .forEach(([name, element]) => {
        let identifier = `satis-${name.replace(/_/g, "-")}`
        customElements.define(identifier, element)
      })
  }
}
