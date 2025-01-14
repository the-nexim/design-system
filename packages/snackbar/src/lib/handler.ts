import {delay} from '@alwatr/delay';
import {createLogger} from '@alwatr/logger';

import {snackbarActionButtonClickedSignal, snackbarCloseButtonClickedSignal, snackbarSignal} from './signal.js';

import type {SnackbarElement} from './element.js';
import type {SnackbarActionHandler, SnackbarOptions} from './type.js';

const logger = createLogger(`${__package_name__}`);

/**
 * Store the function to close the last snackbar.
 */
let closeLastSnackbar: (() => MaybePromise<void>) | null = null;

/**
 * Store the function to unsubscribe the action button handler after close or action button clicked.
 */
let unsubscribeActionButtonHandler: (() => void) | null = null;

/**
 * Store the function to unsubscribe the close button handler after close or action button clicked.
 */
let unsubscribeCloseButtonHandler: (() => void) | null = null;

/**
 * Create snackbar element with given options.
 *
 * @param options - Options for configuring the snackbar.
 * @returns The created snackbar element.
 */
function createSnackbarElement(options: SnackbarOptions): SnackbarElement {
  const element = document.createElement('snack-bar');
  element.setAttribute('content', options.content);

  if (options.addCloseButton === true) {
    element.setAttribute('add-close-button', '');
  }

  if (options.action != null) {
    element.setAttribute('action-button-label', options.action.label);
  }

  return element;
}

/**
 * Handle action button click.
 *
 * @param closeSnackbar - Function to close the snackbar.
 * @param handler - Handler to be called when the action button is clicked.
 */
function handleActionButtonClick(closeSnackbar: () => Promise<void>, handler?: SnackbarActionHandler): Promise<void> {
  logger.logMethod?.('handleActionButtonClick');

  // non-blocking to handler done
  (async () => {
    try {
      await handler!();
    }
    catch (error) {
      logger.error('handleActionButtonClick', 'call_handler_failed', error);
    }
  })();

  return closeSnackbar();
}

/**
 * Displays the snackbar with the given options.
 *
 * @param options - Options for configuring the snackbar.
 */
async function showSnackbar(options: SnackbarOptions): Promise<void> {
  logger.logMethodArgs?.('showSnackbar', {options});

  // Set default duration if not provided
  options.duration ??= '5s';

  const element = createSnackbarElement(options);

  let closed = false;
  const closeSnackbar = async () => {
    if (closed === true) return;
    logger.logMethodArgs?.('closeSnackbar', {options});

    await element.close();
    unsubscribeActionButtonHandler?.();
    unsubscribeCloseButtonHandler?.();

    closed = true;
  };

  await closeLastSnackbar?.();
  closeLastSnackbar = closeSnackbar;

  if (options.action != null) {
    /**
     * Store the function to unsubscribe the action button handler after close or action button clicked.
     *
     * TODO: check why once not work
     */
    unsubscribeActionButtonHandler = snackbarActionButtonClickedSignal.subscribe(
      handleActionButtonClick.bind(null, closeSnackbar, options.action.handler),
    ).unsubscribe;
  }

  if (options.addCloseButton === true) {
    // TODO: check why once not work
    unsubscribeCloseButtonHandler = snackbarCloseButtonClickedSignal.subscribe(closeSnackbar.bind(null)).unsubscribe;
  }

  // Close the last snackbar if it exists
  document.body.appendChild(element);

  // Set a timeout to close the snackbar if duration is not infinite
  if (options.duration !== 'infinite') {
    delay.by(options.duration).then(closeSnackbar);
  }
}

// Subscribe to the snackbar signal to show the snackbar when the signal is emitted.
snackbarSignal.subscribe((options) => {
  showSnackbar(options);
});
