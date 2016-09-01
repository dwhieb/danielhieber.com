# danielhieber.com
[![Build Status](https://travis-ci.org/dwhieb/danielhieber.com.svg?branch=master)](https://travis-ci.org/dwhieb/danielhieber.com)
[![Dependencies Status](https://david-dm.org/dwhieb/danielhieber.com.svg)](https://github.com/dwhieb/danielhieber.com#readme)

The academic homepage of Daniel W. Hieber, graduate student in linguistics at the University of California, Santa Barbara.

Tested on:
* Microsoft Edge
* Google Chrome
* Mozilla Firefox

# Git Workflow
* `master` - Only contains stable, tested code. Automatically pushed to http://danielhieber.com. Pull requests to `master` must pass all required Travis-CI checks, and use a merge commit.
* `dev` - Contains in-progress but stable code. Automatically pushed to http://dev.danielhieber.com for live testing. Pull requests to `dev` should pass all tests, if possible, and use a squash commit.
* `{feature}` - Contains in-progress, unstable code for a particular feature.

# Azure App Settings & Headers

Setting                    | Example
-------------------------- | -------
`WEBSITE_AUTH_LOGOUT_PATH` | `/.auth/logout`
`WEBSITE_AUTH_LOGIN_PATH`  | `{base_url}/.auth/login/{provider}`
`WEBSITE_SITE_NAME`        | `danielhieber`
`WEBSITE_HOSTNAME`         | `danielhieber.azurewebsites.net`

Header                               | Example
------------------------------------ | -------
`x-ms-token-{provider}-access-token` | access token
`x-ms-client-principal-id`           | third-party user ID
`x-ms-client-principal-idp`          | third-party service (`facebook`)
`x-ms-client-principal-name`         | user name with the third-party service (`Daniel William Hieber`)

Endpoint                                                | Description
------------------------------------------------------- | -----------
`/.auth/logout?post_logout_redirect_uri={redirect_uri}` | The logout endpoint
`/.auth/login/{provider}`                               | The login endpoint
`/.auth/me`                                             | User details (include access token)
`/.auth/login/{provider}/callback`                      | Redirect URI

`{provider}`: `aad` | `facebook` | `google` | `microsoft(account)` | `twitter`
