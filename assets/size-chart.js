/*
 * Maattabel-modal.
 *
 * Het dialoog staat in een <template> naast de knop, omdat de knop in de
 * <legend> van de maatfieldset leeft en daar alleen phrasing content mag
 * staan. Bij de eerste klik verhuist het dialoog naar <body>: daar erft het
 * de flexopmaak van de variantkiezer niet en dekt het ::backdrop het hele
 * venster.
 *
 * Sluiten kan op drie manieren: de kruisknop, een klik buiten het paneel en
 * Esc. Die laatste krijgen we gratis van showModal().
 */
if (!customElements.get('size-chart-modal')) {
  customElements.define(
    'size-chart-modal',
    class SizeChartModal extends HTMLElement {
      connectedCallback() {
        this.trigger = this.querySelector('[data-size-chart-open]');
        if (!this.trigger || this.triggerBound) return;
        this.triggerBound = true;
        this.trigger.addEventListener('click', this.open.bind(this));
      }

      disconnectedCallback() {
        // Dawn rendert de productinfo opnieuw bij een variantwissel. Zonder
        // opruimen blijft het verhuisde dialoog in <body> achter en komt er
        // bij de volgende klik een tweede bij.
        this.destroy();
      }

      open() {
        if (!this.dialog) this.build();
        if (!this.dialog) return;
        this.dialog.showModal();
        // De pagina niet laten meescrollen achter de sheet. Dit hoort hier en
        // niet in een eigen klikhandler: die zou bij de eerste klik nog niet
        // gebonden zijn.
        document.body.classList.add('overflow-hidden');
      }

      destroy() {
        if (!this.dialog) return;
        this.dialog.remove();
        this.dialog = null;
        document.body.classList.remove('overflow-hidden');
      }

      build() {
        const template = this.querySelector('template');
        if (!template) return;

        const fragment = template.content.cloneNode(true);
        const dialog = fragment.querySelector('dialog');
        if (!dialog) return;

        // Een eerder verhuisd dialoog met dezelfde id kan nog in <body>
        // staan als deze sectie opnieuw gerenderd is zonder disconnect.
        const stale = dialog.id ? document.getElementById(dialog.id) : null;
        if (stale) stale.remove();

        document.body.appendChild(fragment);
        this.dialog = dialog;

        dialog.querySelectorAll('[data-size-chart-close]').forEach((button) => {
          button.addEventListener('click', () => dialog.close());
        });

        // Het dialoog vult het venster en is zelf doorzichtig; het paneel
        // erbinnen is wat je ziet. Een klik die op het dialoog zelf landt, is
        // dus een klik naast het paneel.
        dialog.addEventListener('click', (event) => {
          if (event.target === dialog) dialog.close();
        });

        // close vuurt bij alle drie de manieren van sluiten, Esc inbegrepen.
        dialog.addEventListener('close', () => {
          document.body.classList.remove('overflow-hidden');
          if (this.trigger) this.trigger.focus();
        });
      }
    }
  );
}
