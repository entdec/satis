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

    application.satisConfiguration = configuration

    console.log("Satis")

    this.application = application
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

    this.application.satis = {
      mouseElement: null,
    }

    // Start of keyboard shortcuts
    document.addEventListener("mouseover", (event) => {
      this.application.satis.mouseElement = event.target
    })

    Mousetrap.bind(["ctrl+1", "ctrl+2", "ctrl+3", "ctrl+4", "ctrl+5", "ctrl+6", "ctrl+7", "ctrl+8", "ctrl+9", "ctrl+0"], (event, combo) => {
      if (this.application.satis.mouseElement) {
        let elm = this.application.satis.mouseElement.closest('[data-controller="satis-tabs"]')
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

    Mousetrap.bind(["h", "left", "pageup"], (event, combo) => {
      if (this.application.satis.mouseElement) {
        let elm = this.application.satis.mouseElement.closest('[data-controller="satis-table"]')
        if (elm) {
          let controller = elm["satis-table"]
          controller.prevPage(event)
        }
      }
    })

    Mousetrap.bind(["l", "right", "pagedown"], (event, combo) => {
      if (this.application.satis.mouseElement) {
        let elm = this.application.satis.mouseElement.closest('[data-controller="satis-table"]')
        if (elm) {
          let controller = elm["satis-table"]
          controller.nextPage(event)
        }
      }
    })

    Mousetrap.bind(["e"], (event, combo) => {
      if (this.application.satis.mouseElement) {
        let elm = this.application.satis.mouseElement.closest('[data-controller="satis-table"]')
        if (elm) {
          let controller = elm["satis-table"]
          controller.export(event)
        }
      }
    })

    Mousetrap.bind(["meta+k"], (event, combo) => {
      if (this.application.satis.mouseElement) {
        let elm = this.application.satis.mouseElement.closest('[data-controller="satis-table"]')
        if (elm) {
          let controller = elm["satis-table"]
          controller.openSearch(event)
        }
      }
    })

    Mousetrap.bind(["esc"], (event, combo) => {
      if (this.application.satis.mouseElement) {
        let elm = this.application.satis.mouseElement.closest('[data-controller="satis-table"]')
        if (elm) {
          let controller = elm["satis-table"]
          controller.reset(event)
        }
      }
    })
  }
}
