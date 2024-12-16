import {AlwatrSignal, AlwatrTrigger} from '@alwatr/flux';
import {createLogger} from '@alwatr/logger';
import {parseDuration, type Duration} from '@alwatr/parse-duration';
import {waitForTimeout} from '@alwatr/wait';

import type {SnackbarComponent} from './element.js';

const logger = createLogger(`${__package_name__}/handler`);

/**
 * @property content - Content to be displayed in the snackbar.
 * @property {action} - The action button configuration.
 * @property action.label - The label for the action button.
 * @property action.handler - The handler function for the action button.
 * @property duration - Duration for which the snackbar is displayed. `-1` for infinite duration.
 * Duration for which the snackbar is displayed.
 * `-1` for infinite duration.
 * @property addCloseButton - Whether to add a close button to the snackbar.
 */
export type SnackbarOptions = {
  content: string;
  action?: {
    label: string;
    handler: () => void;
  };
  duration?: Duration;
  addCloseButton?: boolean;
};

/**
 * Signal for when the snackbar action button is clicked.
 */
export const snackbarActionButtonClickedSignal = new AlwatrTrigger({
  name: 'snackbar-action-button-clicked',
});

/**
 * Signal for displaying the snackbar.
 *
 * @example
 * import {snackbarSignal} from '@nexim/snackbar';
 *
 * snackbarSignal.notify({
 *   content: 'This is a snackbar message',
 *   // The following properties are optional.
 *   action: {
 *     label: 'Undo',
 *     handler: () => {
 *       console.log('Action button clicked');
 *     },
 *   },
 *   duration: '4s',
 *   addCloseButton: true,
 * });
 */
export const snackbarSignal = new AlwatrSignal<SnackbarOptions>({name: 'snackbar'});

// Subscribe to the snackbar signal to show the snackbar when the signal is emitted.
snackbarSignal.subscribe((options) => {
  showSnackbar(options);
});

let closeLastSnackbar: (() => Promise<void>) | null = null;
let unsubscribeActionButtonHandler: (() => void) | null = null;

/**
 * Displays the snackbar with the given options.
 * @param options - Options for configuring the snackbar.
 */
async function showSnackbar(options: SnackbarOptions): Promise<void> {
  logger.logMethodArgs?.('showSnackbar', {options});

  // Parse the duration
  if (options.duration != null) options.duration = parseDuration(options.duration);

  // Set default duration if not provided
  options.duration = parseDuration('4s');

  const element = document.createElement('snack-bar') as SnackbarComponent;

  element.setAttribute('content', options.content);

  if (options.addCloseButton === true) {
    element.setAttribute('add-close-button', '');
  }

  if (options.action != null) {
    element.setAttribute('action-button-label', options.action.label);

    // Subscribe to the action button click
    unsubscribeActionButtonHandler = snackbarActionButtonClickedSignal.subscribe(() => {
      options.action!.handler();

      return closeSnackbar_();
    }).unsubscribe;
  }

  let closed = false;
  const closeSnackbar_ = async () => {
    if (closed === true) return;
    logger.logMethodArgs?.('closeSnackbar', {options});

    await element.close();
    unsubscribeActionButtonHandler?.();
    closed = true;
  };

  // Close the last snackbar if it exists
  await closeLastSnackbar?.();
  closeLastSnackbar = closeSnackbar_;
  document.body.appendChild(element);

  // Set a timeout to close the snackbar if duration is not infinite
  if (options.duration !== -1) {
    waitForTimeout(parseDuration(options.duration)).then(closeSnackbar_);
  }
}
