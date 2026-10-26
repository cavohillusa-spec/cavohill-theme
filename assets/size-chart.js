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
        if (!this.trigger) return;
        if (!this.triggerBound) {
          this.triggerBound = true;
          this.trigger.addEventListener('click', this.open.bind(this));
        }
        this.place();
        if (!this.placed) this.watch();
      }

      disconnectedCallback() {
        // Dawn rendert de productinfo opnieuw bij een variantwissel. Zonder
        // opruimen blijft het verhuisde dialoog in <body> achter en komt er
        // bij de volgende klik een tweede bij.
        //
        // Maar verplaatsen (zie place) is óók een disconnect. Daarom pas
        // opruimen als we een tick later nog steeds buiten het document
        // staan; anders zou een verplaatsing een openstaand dialoog sluiten
        // en de scroll-lock van de pagina halen.
        setTimeout(() => {
          if (!this.isConnected) this.destroy();
        }, 0);
      }

      /*
       * De app kiwi-variant-selector verbergt de fieldsets van het thema met
       * een inline display:none en rendert zijn eigen kleurswatches en
       * maatknoppen. De knop staat dan in een legend die niemand ziet.
       *
       * Die app laat wel een eigen slot staan voor een maattabelknop. Via dat
       * slot vinden we het blok van de maatoptie en zetten we de knop naast
       * het label dat de bezoeker wél ziet.
       *
       * Staat die app er niet, dan gebeurt hier niets en blijft de knop in de
       * legend van het thema — precies waar hij dan hoort, want die legend is
       * zonder de app gewoon zichtbaar.
       */
      place() {
        if (this.placed) return;
        const slot = document.querySelector('.vs-variant-kiwi-sizing-placeholder');
        if (!slot) return;
        const block = slot.closest('.vs-variant') || slot.parentElement;
        const target = (block && block.querySelector('.vs-option__label')) || slot;
        if (target === this.parentElement) {
          this.placed = true;
          return;
        }
        this.placed = true;
        target.appendChild(this);
      }

      watch() {
        if (this.observer) return;
        this.observer = new MutationObserver(() => {
          this.place();
          if (this.placed) this.unwatch();
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
        // De app rendert kort na het laden. Is er na acht seconden geen slot,
        // dan is de app er niet en valt er niets te verplaatsen.
        this.watchTimer = setTimeout(() => this.unwatch(), 8000);
      }

      unwatch() {
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
        if (this.watchTimer) {
          clearTimeout(this.watchTimer);
          this.watchTimer = null;
        }
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
        this.unwatch();
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
