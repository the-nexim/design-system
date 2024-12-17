import type {Duration} from '@alwatr/parse-duration';

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
    id: string;
    label: string;
  };
  duration?: Duration | 'infinite';
  addCloseButton?: boolean;
};
