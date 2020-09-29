// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  googleMapApiKey: [
    'AIzaSyBNGjUOCPx3Xj-HaTo8xmfC8V5mIoie738',
    'AIzaSyBq96V6cGGC4vEu8vxdMXLDukqsM6BnElk',
    'AIzaSyDJ5222kFjHGLaYeDqdQBeWbdgXStgUEv4'
  ],
  bugsnag: {
    enabled: false,
    key: 'dfc53386a4a872dbe6f2cc95864d0e26',
    releaseStage: 'development'
  }
};
