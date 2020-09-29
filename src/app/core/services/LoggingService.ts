import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

// import bugsnag from 'bugsnag-js';
// import BugsnagErrorHandler from 'bugsnag-angular';

@Injectable()
export class LoggingService {
  // private bugsnagClient = bugsnag(environment.bugsnag.key);
  // private BugsnagErrorHandler = new BugsnagErrorHandler(this.bugsnagClient);

  constructor() {
    if (environment.bugsnag.enabled) {
      // this.BugsnagErrorHandler.notifyReleaseStages = ['production'];
      // this.BugsnagErrorHandler.releaseStage = environment.production ? 'production' : 'development';
      // this.BugsnagErrorHandler.autoNotify = true;
    }
  }

  logException(message: string, url: string, stack: string, metaData?: any) {
    if (environment.bugsnag.enabled) {
      // this.bugsnagClient.notify(new Error(stack));


      // this.BugsnagErrorHandler.user = url;
      // this.BugsnagErrorHandler.metaData = metaData;
      // this.BugsnagErrorHandler.notify(new Error(stack));
    }
  }
}
