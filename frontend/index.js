import { definitionsFromContext } from "stimulus/webpack-helpers"
import { Application } from "stimulus"

import Mousetrap from "mousetrap"

import "@fortawesome/fontawesome-pro/js/all"
import { config, library, dom } from "@fortawesome/fontawesome-svg-core"
config.mutateApproach = "sync"
dom.watch()

import tippy from "tippy.js"
import "tippy.js/dist/tippy.css" // optional for styling

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

    // Add an event listener for mouseover, for keyboard events
    document.addEventListener("mouseover", (event) => {
      this.application.satis.mouseElement = event.target
    })

    // Setup all controllers
    Satis.setupControllers()

    // Load custom elements
    Satis.setupCustomElements()

    // For keyboard shortcuts
    if (navigator.userAgent.indexOf("Mac OS X") != -1) {
      document.documentElement.classList.add("mac")
    } else {
      document.documentElement.classList("pc")
    }

    // Show tooltips
    // TODO: Try to combine this in one event call, this doesn't work for tables yet
    tippy("[data-tooltip-content]", {
      content: (reference) => reference.getAttribute("data-tooltip-content"),
    })

    document.documentElement.addEventListener("turbo:load", () => {
      tippy("[data-tooltip-content]", {
        content: (reference) => reference.getAttribute("data-tooltip-content"),
      })
    })

    document.addEventListener("DOMContentLoaded", () => {
      tippy("[data-tooltip-content]", {
        content: (reference) => reference.getAttribute("data-tooltip-content"),
      })
    })
  }

  // Register a keybinding found a controller
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

  // Setup all controllers
  static setupControllers() {
    const utilityControllers = require.context("./utility_controllers", true, /\.js$/)
    const regularControllers = require.context("./controllers", true, /\.js$/)
    const componentControllers = require.context("../app/components/", true, /component_controller\.js$/)

    regularControllers
      .keys()
      .map((key) => {
        const [_, name] = /([a-z\_]+)_controller\.js$/.exec(key)
        return [name, regularControllers(key).default]
      })
      .filter(([name, controller]) => {
        return name != "application"
      })
      .forEach(([name, controller]) => {
        let identifier = `satis-${name.replace(/_/g, "-")}`
        this.application.register(identifier, controller)
      })

    componentControllers
      .keys()
      .map((key) => {
        // Take the last part (before component_controller) of the path as the name
        const [_, name] = /([^/]+)\/component_controller\.js$/.exec(key)
        return [name, componentControllers(key).default]
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

    this.application.load(definitionsFromContext(regularControllers).concat(definitionsFromContext(componentControllers)))

    if (this.application.satis.configuration.utilityControllers != false) {
      utilityControllers
        .keys()
        .map((key) => {
          const [_, name] = /([a-z\_]+)_controller\.js$/.exec(key)
          return [name, utilityControllers(key).default]
        })
        .forEach(([name, controller]) => {
          this.application.register(name.replace(/_/g, "-"), controller)
        })
    } else {
      console.log("Not loading Utility controllers")
    }
  }

  static setupCustomElements() {
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
