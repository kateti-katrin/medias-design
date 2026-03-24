// application.js — site-001 entry point
import "@hotwired/turbo-rails";
import "./controllers";
import "./components/nav_toggle";

// Mount React ServicesApp if element exists
import { mountServicesApp } from "./components/services_app";
document.addEventListener("turbo:load", () => {
  const el = document.getElementById("services-app");
  if (el) mountServicesApp(el);
});
