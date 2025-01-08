import {delay} from '@alwatr/delay';
import {LightDomMixin, LoggerMixin} from '@nexim/element';
import {html, LitElement, nothing, type PropertyValues, type TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {snackbarActionButtonClickedSignal, snackbarCloseButtonClickedSignal} from './signal.js';
import {waitForNextFrame} from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'snack-bar': SnackbarElement;
  }
}

@customElement('snack-bar')
export class SnackbarElement extends LightDomMixin(LoggerMixin(LitElement)) {
  /**
   * The content to be displayed inside the snackbar.
   */
  @property({type: String}) content = '';

  /**
   * The label for the action button. If null, the action button will not be rendered.
   */
  @property({type: String, attribute: 'action-button-label'}) actionButtonLabel: string | null = null;

  /**
   * Whether to add a close button to the snackbar.
   */
  @property({type: Boolean, attribute: 'add-close-button'}) addCloseButton = false;

  /**
   * Duration for the open and close animation in milliseconds.
   */
  private static openAndCloseAnimationDuration__ = 200; // ms

  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);

    // wait for render complete, then open the snackbar to start the opening animation
    waitForNextFrame().then(() => {
      this.setAttribute('open', '');
    });
  }

  /**
   * Close the snackbar and remove it from the DOM.
   * Waits for the closing animation to end before removing the element.
   *
   * @internal
   * This method should be used by the package API, not directly, to ensure proper signal unsubscription.
   */
  async close(): Promise<void> {
    this.logger_.logMethod?.('close');

    this.removeAttribute('open');

    await delay.by(SnackbarElement.openAndCloseAnimationDuration__);
    this.remove();
  }

  /**
   * Handle the close button click event.
   * Sends a signal when the action button is clicked.
   */
  private closeButtonClickHandler__(): void {
    this.logger_.logMethod?.('closeButtonClickHandler__');

    snackbarCloseButtonClickedSignal.notify();
  }

  /**
   * Handle the action button click event.
   * Sends a signal when the action button is clicked.
   */
  private actionButtonClickHandler__(): void {
    this.logger_.logMethod?.('actionButtonClickHandler__');

    snackbarActionButtonClickedSignal.notify();
  }

  /**
   * Render the snackbar component.
   */
  protected override render(): unknown {
    super.render();

    const actionButtonHtml = this.renderActionButton__();
    const closeButtonHtml = this.renderCloseButton__();

    let actionButtonHandler: TemplateResult | typeof nothing = nothing;
    if (actionButtonHtml != nothing || closeButtonHtml != nothing) {
      actionButtonHandler = html`<div>${actionButtonHtml} ${closeButtonHtml}</div>`;
    }

    return [html`<span>${this.content}</span>`, actionButtonHandler];
  }

  /**
   * Render the action button.
   */
  private renderActionButton__(): TemplateResult | typeof nothing {
    if (this.actionButtonLabel == null) return nothing;
    this.logger_.logMethodArgs?.('renderActionButton__', {actionLabel: this.actionButtonLabel});

    return html` <button class="action-button" @click=${this.actionButtonClickHandler__.bind(this)}>${this.actionButtonLabel}</button> `;
  }

  /**
   * Render the close button.
   */
  private renderCloseButton__(): TemplateResult | typeof nothing {
    if (this.addCloseButton === false) return nothing;
    this.logger_.logMethod?.('renderCloseButton__');

    return html`
      <button class="close-button" @click=${this.closeButtonClickHandler__.bind(this)}>
        <span class="icon">close</span>
      </button>
    `;
  }
}
