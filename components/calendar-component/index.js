class CalendarComponent extends HTMLElement {
  #team;
  #shadow;
  #nav = 0;

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });
    this.onInit();
  }

  /**
   * Busca a estrutura do componente no HTML
   * @param {string} componentLinkTemplate
   * @param {any} shadow
   */
  getComponentTemplate(componentLinkTemplate, shadow) {
    fetch(componentLinkTemplate)
      .then((response) => response.text())
      .then((response) => {
        const contentWrapper = document.createElement("div");
        contentWrapper.innerHTML = response;

        shadow.appendChild(contentWrapper);
      });
  }

  loadAttributes() {
    this.#team = this.getAttribute("team");
  }

  loadCalendar() {
    const currentDate = new Date();
  }

  onInit() {
    this.getComponentTemplate(
      "/components/calendar-component/index.html",
      this.#shadow
    );

    this.loadAttributes();
  }
}

customElements.define("calendar-component", CalendarComponent);
