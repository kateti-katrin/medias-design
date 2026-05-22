import { Controller } from "@hotwired/stimulus"

// Пример Stimulus-контроллера (заготовка как у преподавателя).
// Используется так: <div data-controller="hello"></div>
//
// Stimulus автоматически найдёт этот контроллер благодаря /controllers/index.js
export default class extends Controller {
  connect() {
    this.element.textContent = "Hello from Stimulus 👋"
  }
}
