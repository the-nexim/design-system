import {createLogger} from '@alwatr/logger';
import {parseDuration} from '@alwatr/parse-duration';
import {waitForTimeout} from '@alwatr/wait';

import {snackbarActionButtonClickedSignal, snackbarCloseButtonClickedSignal, snackbarSignal} from './signal.js';

import type {SnackbarElement} from './element.js';
import type {SnackbarActionHandler, SnackbarOptions} from './type.js';

const logger = createLogger(`${__package_name__}/handler`);

/**
 * Store the function to close the last snackbar.
 */
let closeLastSnackbar: (() => Promise<void>) | null = null;

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
function handleActionButtonClick(closeSnackbar: () => Promise<void>, handler?: SnackbarActionHandler): void {
  logger.logMethod?.('handleActionButtonClick');

  const actionButtonClickHandler = () => {
    logger.logOther?.('Snackbar action button clicked.');

    handler?.();
    return closeSnackbar();
  };

  /**
   * Store the function to unsubscribe the action button handler after close or action button clicked.
   *
   * TODO: check why once not work
   */
  unsubscribeActionButtonHandler = snackbarActionButtonClickedSignal.subscribe(actionButtonClickHandler.bind(null)).unsubscribe;
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

  if (options.action != null) {
    handleActionButtonClick(closeSnackbar, options.action.handler);
  }

  if (options.addCloseButton === true) {
    // TODO: check why once not work
    unsubscribeCloseButtonHandler = snackbarCloseButtonClickedSignal.subscribe(closeSnackbar.bind(null)).unsubscribe;
  }

  // Close the last snackbar if it exists
  await closeLastSnackbar?.();
  closeLastSnackbar = closeSnackbar;
  document.body.appendChild(element);

  // Set a timeout to close the snackbar if duration is not infinite
  if (options.duration !== 'infinite') {
    waitForTimeout(parseDuration(options.duration)).then(closeSnackbar);
  }
}

// Subscribe to the snackbar signal to show the snackbar when the signal is emitted.
snackbarSignal.subscribe((options) => {
  showSnackbar(options);
});
