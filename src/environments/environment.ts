// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API_URL: 'http://journalsite.local/api/v1',
  SERVER_URL: 'http://journalsite.local/api/v1',
  MAPBOX_ACCESS_TOKEN: {
    accessToken: 'pk.eyJ1IjoiaG91c2VhZnJpY2EiLCJhIjoiY2tkM20wa2UyMDk1dTJ4b2N4ZWN5OTBhdCJ9.TjkuDwDkxfL1WdCO1FcsmQ'
  },
  OAUTH_REDIRECT_URL: 'http://localhost:3000/dashboard',
  OAUTH_CLIENT_ID: '',
  OAUTH_CLIENT_SECRET: ''
};

//pk.eyJ1IjoibmV4dGVhcnRoIiwiYSI6ImNrcWF2YmVtcTBjaTIydmsxMnVvNmk3aGYifQ.mDtuHWG2eeALeo8b0PvK_w'