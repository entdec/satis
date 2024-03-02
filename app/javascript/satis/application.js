console.log("Satis")
import "@hotwired/turbo-rails"
import "satis/controllers"
import "satis/utility_controllers"
import "trix"
import "@rails/actiontext"

import SatisCopyable from "satis/elements/copyable_element"
customElements.define('satis-copyable', SatisCopyable)
