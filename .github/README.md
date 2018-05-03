# [danielhieber.com](https://danielhieber.com)

The academic homepage of Daniel W. Hieber, graduate student in linguistics at the University of California, Santa Barbara.

# Deployment
Prince XML takes too long to install and unpack, so it needs to be uploaded manually. Install and unpack the 64-bit binary on your machine, and then FTP the folder to the site (making sure that the site is also running on 64-bit).

# Node Version
Do not specify the Node.js version in `package.json`. Instead, specify it directly in the Azure Web App Settings. Be sure to list the complete version number explicitly, rather than an expression to match. This will ensure that the command line in the virtual machine is running the proper Node.js version.

# Supported Browsers
  - Chrome (desktop)
  - Chrome (mobile)
  - Safari (deskop)
  - Safari (mobile)
  - Edge (desktop)
  - Edge (mobile)
  - Firefox (desktop)
  - Firefox (mobile)
