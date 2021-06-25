import { definitionsFromContext } from "stimulus/webpack-helpers"
import { Application } from "stimulus"

export class Satis {
  static start(application) {
    if (!application) {
      application = Application.start()
    }

    console.log("Satis")

    this.application = application
    const context = require.context("./controllers", true, /\.js$/)
    this.application.load(definitionsFromContext(context))

    const contextComponents = require.context("../../app/components", true, /_controller\.js$/)
    application.load(definitionsFromContext(context).concat(definitionsFromContext(contextComponents)))
  }
}
