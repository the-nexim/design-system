import {packageTracer} from '@alwatr/package-tracer';

__dev_mode__: packageTracer.add(__package_name__, __package_version__);

import './lib/handler.js';

export * from './lib/element.js';
export {snackbarSignal} from './lib/signal.js';
