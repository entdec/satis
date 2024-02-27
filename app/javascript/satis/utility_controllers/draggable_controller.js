import { Controller } from "@hotwired/stimulus"

import Sortable from "sortablejs"

/*
  This Stimulus controller uses sortablejs for drag and drop, it then sends a JSON body with the
  following items to the designated URL:

  index     : the new index
  item-id   : the item's id (if specified)
  parent-id : the parent id (if specified)

  Example usages:

  <div data-controller="draggable">
    <div data-draggable-url="/url/to/item1">Item 1</div>
    <div data-draggable-url="/url/to/item2">Item 2</div>
    <div data-draggable-url="/url/to/item3">Item 3</div>
  </div>

  The above will send a PATCH request with the new index to the items' data-draggable-url

  If you want another request type you can specify it like so:

  <div data-controller="draggable" data-draggable-method="PUT">
    <div data-draggable-url="/url/to/item1">Item 1</div>
    <div data-draggable-url="/url/to/item2">Item 2</div>
    <div data-draggable-url="/url/to/item3">Item 3</div>
  </div>

  The above will send PUT requests

  You can also use one URL for all your items:

  <div data-controller="draggable" data-draggable-url="/url/to/items" data-draggable-item-id="true">
    <div data-draggable-item-id="1">Item 1</div>
    <div data-draggable-item-id="2">Item 2</div>
    <div data-draggable-item-id="3">Item 3</div>
  </div>

  The above will send a PATCH request with the new index and the item-id to the data-draggable-url. If
  data-draggable-item-id is true it will not send a request without an item-id

  If you want to use a nested structure you can specify a selector to specify which elements
  under the controller's element will be activated, specifying the data-draggable-group allows
  you to drag items between the different lists:

  <div data-controller="draggable" data-draggable-url="/url/to/items" data-draggable-selector="ul" data-draggable-group="nested" data-draggable-item-id="true" data-draggable-parent-id="true">
    <ul>
      <li data-draggable-item-id="1">Item 1</li>
      <li data-draggable-item-id="2">
        Item 2
        <ul data-draggable-parent-id="2">
          <li data-draggable-item-id="3">Item 3</li>
        </ul>
      </li>
    </ul>
  </div>

  The above will also require a data-draggable-parent-id to drag an item to another list
 */
export default class extends Controller {
  connect() {
    const self = this

    let selector = self.data.get("selector")

    if (selector) {
      self.element.querySelectorAll(selector).forEach((el) => {
        self.sortable(el)
      })
    } else {
      self.sortable(self.element)
    }
  }

  sortable(element) {
    const self = this

    let options = {
      animation: 150,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      onEnd: (evt) => {
        let url = self.data.get("url") || evt.item.getAttribute("data-draggable-url")
        let method = self.data.get("method") || evt.item.getAttribute("data-draggable-method") || "PATCH"
        let csrfToken = document.querySelector("meta[name=csrf-token]").content
        let itemIdSelector = self.data.get("item-id-selector")
        let itemId = evt.item.getAttribute("data-draggable-item-id")
        if (!itemId && itemIdSelector) {
          itemId = evt.item.querySelector(itemIdSelector).getAttribute("data-draggable-item-id")
        }
        let parentId = evt.to.getAttribute("data-draggable-parent-id")
        let newIndex = evt.newIndex

        if (self.data.get("item-id") && !itemId) {
          return
        }

        if (self.data.get("parent-id") && !parentId) {
          return
        }

        let response = fetch(url, {
          method: method,
          headers: {
            Accept: "application/json, text/javascript",
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            item_id: itemId,
            parent_id: parentId,
            index: newIndex,
          }),
        }).then((response) => {
          var event
          if (response.ok) {
            event = new CustomEvent("draggable.success", { detail: { element: self.element } })
            self.element.dispatchEvent(event)
          } else if (!response.ok) {
            event = new CustomEvent("draggable.error", { detail: { element: self.element } })
            self.element.dispatchEvent(event)
            window.alert("An unexpected error occured, your drop possibly failed.")
          }
        })
      },
    }

    if (self.data.get("handle")) {
      options["handle"] = self.data.get("handle")
    }

    if (self.data.get("group")) {
      options["group"] = self.data.get("group")
    }

    if (self.data.get("item-selector")) {
      options["draggable"] = self.data.get("item-selector")
    }

    Sortable.create(element, options)
  }
}
