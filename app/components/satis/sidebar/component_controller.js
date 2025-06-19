import ApplicationController from "satis/controllers/application_controller"
import { debounce } from "satis/utils"

export default class SidebarComponentController extends ApplicationController {
    connect() {
        super.connect();
        this.initializeSidebar();
    }

    initializeSidebar() {
        let sidebar_collapse = document.querySelector(".sidebar");
        let topbar = document.querySelector(".topbar");
        let page_body = document.querySelector(".page_body");
        let sidebarBtn = document.querySelector(".arrow");

        // Check stored state and apply it
        const isClosed = sessionStorage.getItem('sidebarClosed') === 'true';
        if (isClosed) {
            sidebar_collapse?.classList.add("close");
            topbar?.classList.add("close");
            page_body?.classList.add("close");
        }

        if (sidebarBtn) {
            sidebarBtn.addEventListener("click", () => {
                const isClosed = sidebar_collapse.classList.toggle("close");
                topbar.classList.toggle("close");
                page_body.classList.toggle("close");

                // Save the current state to sessionStorage
                sessionStorage.setItem('sidebarClosed', isClosed);
            });
        }
    }
}

// Ensure the function runs on every Turbo page load
document.addEventListener("turbo:load", () => {
    const controller = new SidebarComponentController();
    controller.initializeSidebar();
});

