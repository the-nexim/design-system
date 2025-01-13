import {packageTracer} from '@alwatr/package-tracer';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

import {LightDomMixin, LoggerMixin} from '@nexim/element';
import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

// <input
// type="text"
// {% if params.model %}x-model="{{ params.model }}"{% endif %}
// {% if params.onInput %}@input.debounce.250ms="{{ params.onInput }}"{% endif %}
// placeholder="{{ params.placeholder }}"
// class="border border-onSecondaryContainer border-opacity-10 focus-visible:outline-2 outline-tertiary peer bg-transparent inline-block px-4 h-10 rounded-md shadow-sm {{ params.customInputClass }}"
// autocomplete="{{ params.autocomplete | default('off') }}"
// value="{{ params.value }}"
// />

declare global {
  interface HTMLElementTagNameMap {
    'text-field-input': HTMLElementTagNameMap['input'];
  }
}

@customElement('snack-bar')
export class SnackbarElement extends LightDomMixin(LoggerMixin(LitElement)) {
  @property({ type: String }) model = '';
  @property({ type: String }) placeHolder = '';
  @property({ type: String }) customInputClass = '';
  @property({ type: Boolean }) autoComplete = false;
  @property({ type: String }) value = '';

  @state() storeValue: EventTarget | string = '';

  getValue() {
    return this.storeValue;
  }

  setValue(newValue: EventTarget | string) {
    this.storeValue = newValue;
  }

  protected override render(): unknown {
    return html`
      <input
        type="text"
        placeholder="${this.placeHolder}"
        class="${this.customInputClass}"
        autocomplete="${this.autoComplete ? 'on' : 'off'}"
        value="${ifDefined(this.getValue())}"
        @input="${(e: Event) => this.setValue((e.target as HTMLInputElement).value)}"
      />
    `
  }
}
