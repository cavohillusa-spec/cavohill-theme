/*
  Harbor Hudson — stipjes onder de mobiele productgalerij.

  Dawn's slider-component toont onder de galerij een teller ("1 / 5") met
  pijltjes. Op mobiel willen we stipjes. Die bouwen we hier op uit de slides
  die er echt staan, in plaats van ze in Liquid mee te renderen: met
  hide_variants kan het aantal zichtbare slides afwijken van het aantal
  media-items, en zo blijft het altijd kloppen.

  Het is een custom element, dus het initialiseert zichzelf opnieuw zodra Dawn
  de galerij vervangt na een variantwissel. Zonder JavaScript blijft de galerij
  gewoon swipebaar — de stipjes zijn een extraatje, geen voorwaarde.
*/
if (!customElements.get('hh-gallery-dots')) {
  class HhGalleryDots extends HTMLElement {
    connectedCallback() {
      this.sliderComponent = this.closest('slider-component');
      if (!this.sliderComponent) return;

      this.slider = this.sliderComponent.querySelector('[id^="Slider-"]');
      if (!this.slider) return;

      this.render();

      // Een nieuwe ResizeObserver per verbinding; die stopt vanzelf als het
      // element uit de pagina verdwijnt.
      this.onScroll = this.syncActive.bind(this);
      this.slider.addEventListener('scroll', this.onScroll, { passive: true });

      this.resizeObserver = new ResizeObserver(() => this.render());
      this.resizeObserver.observe(this.slider);
    }

    disconnectedCallback() {
      if (this.slider && this.onScroll) this.slider.removeEventListener('scroll', this.onScroll);
      if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    get visibleSlides() {
      // clientWidth 0 betekent verborgen: variantfoto's die Dawn wegfiltert,
      // of op desktop alle slides behalve de actieve.
      return Array.from(this.sliderComponent.querySelectorAll('[id^="Slide-"]')).filter(
        (slide) => slide.clientWidth > 0
      );
    }

    render() {
      const slides = this.visibleSlides;

      if (slides.length < 2) {
        this.innerHTML = '';
        this.hidden = true;
        return;
      }

      this.hidden = false;

      if (this.dots && this.dots.length === slides.length) {
        this.syncActive();
        return;
      }

      this.innerHTML = '';
      const list = document.createElement('div');
      list.className = 'hh-dots__list';

      slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hh-dots__dot';
        dot.setAttribute('aria-label', `${index + 1} / ${slides.length}`);
        dot.addEventListener('click', () => {
          this.slider.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
        });
        list.appendChild(dot);
      });

      this.appendChild(list);
      this.dots = Array.from(list.children);
      this.syncActive();
    }

    syncActive() {
      if (!this.dots || this.dots.length === 0) return;

      const slides = this.visibleSlides;
      if (slides.length < 2) return;

      const step = slides[1].offsetLeft - slides[0].offsetLeft;
      if (!step) return;

      const index = Math.min(this.dots.length - 1, Math.max(0, Math.round(this.slider.scrollLeft / step)));

      this.dots.forEach((dot, i) => {
        dot.classList.toggle('hh-dots__dot--active', i === index);
        if (i === index) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    }
  }

  customElements.define('hh-gallery-dots', HhGalleryDots);
}
