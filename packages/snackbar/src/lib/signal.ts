import {AlwatrSignal} from '@alwatr/flux';

import type {SnackbarOptions} from './type.js';

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
export const snackbarActionButtonClickedSignal = /* @__PURE__ */ new AlwatrSignal<{id: string}>({
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
export const snackbarSignal = /* @__PURE__ */ new AlwatrSignal<SnackbarOptions>({name: 'snackbar'});
