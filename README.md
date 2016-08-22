# danielhieber.com
[![Build Status](https://travis-ci.org/dwhieb/danielhieber.com.svg?branch=master)](https://travis-ci.org/dwhieb/danielhieber.com)

The academic homepage of Daniel W. Hieber, graduate student in linguistics at the University of California, Santa Barbara.

Tested on:
* Microsoft Edge
* Google Chrome
* Mozilla Firefox

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
