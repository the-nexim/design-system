import {AlwatrSignal, AlwatrTrigger} from '@alwatr/flux';

import type {SnackbarOptions} from './type.js';

/**
 * Signal triggered when the snackbar action button is clicked to close snackbar.
 */
export const snackbarActionButtonClickedSignal = /* @__PURE__ */ new AlwatrTrigger({
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
