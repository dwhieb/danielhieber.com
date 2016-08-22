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
`WEBSITE_SITE_NAME`        | `danielhieber`
`WEBSITE_HOSTNAME`         | `danielhieber.azurewebsites.net`

Header                             | Example
---------------------------------- | -------
`x-ms-token-facebook-access-token` | {Facebook access token}
`x-ms-client-principal-id`         | {Third-party (Facebook) user ID}
`x-ms-client-principal-idp`        | `facebook` (Third-party service)
`x-ms-client-principal-name`       | `Daniel William Hieber` (User name with the third-party service)

Endpoint                                                | Description
------------------------------------------------------- | -----------
`/.auth/logout?post_logout_redirect_uri={redirect_uri}` | The logout endpoint
