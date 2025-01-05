import type {Duration} from '@alwatr/parse-duration';

/**
 * Snackbar action handler.
 */
export type SnackbarActionHandler = () => Promise<void> | void;

/**
 * Snackbar config.
 */
export type SnackbarOptions = {
  /**
   * Content to be displayed in the snackbar.
   */
  content: string;

  /**
   * The action button configuration.
   */
  action?: {
    /**
     * The handler to be called when the action button is clicked.
     */
    handler: SnackbarActionHandler;

    /**
     * The label for the action button.
     */
    label: string;
  };

  /**
   * Duration for which the snackbar is displayed. `infinite` for infinite duration.
   *
   * @default `5s`
   */
  duration?: Duration | 'infinite';

  /**
   * Whether to add a close button to the snackbar.
   */
  addCloseButton?: boolean;
};
