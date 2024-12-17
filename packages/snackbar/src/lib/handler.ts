import {AlwatrSignal, AlwatrTrigger} from '@alwatr/flux';
import {createLogger} from '@alwatr/logger';
import {parseDuration, type Duration} from '@alwatr/parse-duration';
import {waitForTimeout} from '@alwatr/wait';

import type {SnackbarComponent} from './element.js';

const logger = createLogger(`${__package_name__}/handler`);

/**
 * @property content - Content to be displayed in the snackbar.
 * @property [action] - The action button configuration.
 * @property action.label - The label for the action button.
 * @property action.handler - The handler function for the action button.
 * @property duration - Duration for which the snackbar is displayed. `infinite` for infinite duration.
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
 * Signal triggered when the snackbar action button is clicked.
 *
 * This signal is used to notify listeners that the action button
 * on the snackbar component has been clicked. It can be used to
 * perform any necessary actions in response to the button click.
 *
 * @example
 * snackbarActionButtonClickedSignal.addListener(() => {
 *   console.log('Snackbar action button was clicked!');
 * });
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
 *   action: {
 *     label: 'Undo',
 *     handler: () => {
 *       console.log('Action button clicked');
 *     },
 *   },
 *   duration: '5s',
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
 *
 * @param options - Options for configuring the snackbar.
 */
async function showSnackbar(options: SnackbarOptions): Promise<void> {
  logger.logMethodArgs?.('showSnackbar', {options});

  // Set default duration if not provided
  options.duration ??= '5s';

  const element = document.createElement('snack-bar') as SnackbarComponent;

  element.setAttribute('content', options.content);

  if (options.addCloseButton === true) {
    element.setAttribute('add-close-button', '');
  }

  if (options.action != null) {
    element.setAttribute('action-button-label', options.action.label);

    // Subscribe to the action button click
    unsubscribeActionButtonHandler = snackbarActionButtonClickedSignal.subscribe(() => {
      logger.logOther?.('Snackbar action button clicked.');

      options.action!.handler();

      return closeSnackbar();
    }).unsubscribe;
  }

  let closed = false;
  const closeSnackbar = async () => {
    if (closed === true) return;
    logger.logMethodArgs?.('closeSnackbar', {options});

    await element.close();
    unsubscribeActionButtonHandler?.();
    closed = true;
  };

  // Close the last snackbar if it exists
  await closeLastSnackbar?.();
  closeLastSnackbar = closeSnackbar;
  document.body.appendChild(element);

  // Set a timeout to close the snackbar if duration is not infinite
  if (options.duration !== 'infinite') {
    waitForTimeout(parseDuration(options.duration)).then(closeSnackbar);
  }
}
