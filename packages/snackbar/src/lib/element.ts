import {delay} from '@alwatr/delay';
import {LightDomMixin, LoggerMixin} from '@nexim/element';
import {html, css, LitElement, nothing, type PropertyValues, type TemplateResult} from 'lit';
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

  static override styles = css`
    .snack-bar {
      background-color: var(--inverseSurface);
      color: var(--surface);
      box-shadow: var(--elevation-3);
      z-index: var(--z-snackbar);
      font-size: var(--labelLarge);
      padding-bottom: var(--bottom-safe-32);
      padding-bottom: var(--extended-bottom-safe-12);
      position: fixed;
      right: 1rem;
      left: 1rem;
      display: flex;
      min-height: 3rem;
      flex-shrink: 0;
      transform: translateY(2rem);
      transform: translateZ(0);
      user-select: none;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 1rem;
      border-radius: 0.375rem;
      padding: 0.5rem 1rem;
      opacity: 0;
      transition: all 0.2s ease-out;
      @media (min-width: 768px) {
        left: auto;
        max-width: 24rem;
      }

      &[open] {
        pointer-events: auto;
        opacity: 1;
        transition: opacity 0.2s ease-in;
      }

      > span {
        flex-grow: 1;
        padding: 0.5rem 0;
      }

      > div {
        font-size: var(--bodyMedium);
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        border-radius: 9999px;

        & > * {
          cursor: pointer;
          border-radius: 9999px;
          padding: 0.5rem;
        }
      }

      .action-button {
        background-color: var(--inversePrimary);
      }

      .close-button {
        background-color: var(--surface);
      }
    }
  `;

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
