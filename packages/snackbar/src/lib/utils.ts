import {waitForAnimationFrame, waitForTimeout} from '@alwatr/wait';

/**
 * Waits for the next frame to ensure the DOM has been fully calculated.
 * This minimizes the chance that querying the DOM will cause a costly reflow.
 *
 * This function uses `requestAnimationFrame` to schedule code to run immediately before the repaint,
 * followed by `setTimeout` with a delay of 0 to execute code as soon as possible after the repaint.
 *
 * @see https://stackoverflow.com/a/47184426
 */
export function waitForNextFrame(): Promise<void> {
  return new Promise((resolve) => {
    waitForAnimationFrame().then(() => {
      waitForTimeout(0).then(resolve);
    });
  });
}
