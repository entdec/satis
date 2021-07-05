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
  }
}
