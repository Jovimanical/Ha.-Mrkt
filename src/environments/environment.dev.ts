// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng serve --env=dev` then `environment.dev.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API_URL: 'http://localhost:8080/api/v1',
  SERVER_URL: 'http://localhost:8080',
  MAPBOX_ACCESS_TOKEN:{
    accessToken: 'pk.eyJ1IjoibmV4dGVhcnRoIiwiYSI6ImNrcWF2YmVtcTBjaTIydmsxMnVvNmk3aGYifQ.mDtuHWG2eeALeo8b0PvK_w'
  },
  GOOGLE_MAP_API_KEY:'AIzaSyD3GSN-lKlYxfxscH0kMNE6W1RSB2kPvbw',
  OAUTH_REDIRECT_URL: 'http://localhost:3000/store',
  OAUTH_CLIENT_ID: '',
  OAUTH_CLIENT_SECRET: ''
};
