import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "results"];

  connect() {}

  search(event) {
    const query = this.inputTarget.value.trim();

    if (query.length === 0) {
      this.displayResults([]);
      return;
    }

    fetch(`/satis/navigation/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => this.displayResults(data))
      .catch(error => console.error("Error fetching results:", error));
  }

  displayResults(results) {
    const resultsContainer = this.resultsTarget;
    resultsContainer.innerHTML = ""; 

    if (results.length > 0) {
      this.resultsTarget.nextElementSibling.classList.add("hidden");

      results.slice(0, 10).forEach(result => {
        const item = document.createElement("li");
        item.textContent = result.name;
        item.className = "result-item p-2 hover:bg-gray-100 cursor-pointer"; 
        resultsContainer.appendChild(item);
      });
      } 
    else {
      this.resultsTarget.nextElementSibling.classList.remove("hidden"); 
    }
  }
}
