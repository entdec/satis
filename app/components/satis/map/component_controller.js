// map_controller.js
import { Controller } from "stimulus"
import L from "leaflet"

export default class extends Controller {
  static targets = [
    "container",
  ]
  static values = { urls: String, latitude: Number, longitude: Number, zoomLevel: Number, geoJsonUrl: String }

  connect() {

    this.map = L.map(this.containerTarget).setView([this.latitudeValue, this.longitudeValue], this.zoomLevelValue);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(this.map);

    // this.map.setView() etc... as normal.

    // Load layers and setup event handlers, for example:
    fetch(this.geoJsonUrlValue)
      .then(response => response.json())
      .then(data => {
        console.log(this.geoJsonUrlValue, "loading data", data)

        L.geoJSON(data, {
          onEachFeature: (feature, layer) => {
            layer.on('click', () => this.onClick(layer))
          }
        }).addTo(this.map);
      })

  }

  onClick(layer) {
    console.log(layer)
  }
}
