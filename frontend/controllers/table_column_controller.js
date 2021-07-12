import {Controller} from "stimulus"

/***
 * Table-Column controller
 * Part of action_table by EntDec - open source
 */
export default class extends Controller {
  static targets = [];

  connect() {
    this.updateDirection(this.data.get('direction').toLowerCase());
  }

  changeDirection() {
    this.updateDirection(this.orderDirection == 'asc' ? 'desc' : 'asc');

    // Reset direction on all other columns
    this.peers().forEach(peer => { peer.updateDirection(); });

    let event = new CustomEvent('table-column.orderChanged', { bubbles: true, cancelable: true, detail: { orderDirection: this.orderDirection }});
    this.element.dispatchEvent(event);
  }

  updateDirection(newDirection) {
    this.orderDirection = newDirection;
    this.element.classList.remove('order', 'desc', 'asc');
    if (this.orderDirection === 'undefined') {
      return;
    }

    this.element.classList.add('order', this.orderDirection);
  }

  peers() {
    return this.application.controllers.filter(controller => {
      return controller.context.scope.identifier === this.context.scope.identifier && controller != this;
    });
  }

  disconnect() {
  }
}
