import type {Duration} from '@alwatr/parse-duration';

/**
 * @property content - Content to be displayed in the snackbar.
 * @property [action] - The action button configuration.
 * @property action.label - The label for the action button.
 * @property action.signalId - The signal ID to be emitted when the action button is clicked.
 * @property duration - Duration for which the snackbar is displayed. `infinite` for infinite duration.
 * @property addCloseButton - Whether to add a close button to the snackbar.
 */
export type SnackbarOptions = {
  content: string;
  action?: {
    signalId: string;
    label: string;
  };
  duration?: Duration | 'infinite';
  addCloseButton?: boolean;
};
