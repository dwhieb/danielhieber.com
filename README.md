# [danielhieber.com](https://danielhieber.com)

The academic homepage of Daniel W. Hieber, graduate student in linguistics at the University of California, Santa Barbara.

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

# Printing
* Use Prince PDF
* Turn off JavaScript (uncheck `Enable Document Scripts`)
* Remove Prince logo from PDF (using Adobe Acrobat Pro)
* Prince does not currently support the following (as of v11.3), meaning that you need to include fallback CSS in your print media styles:
  - flexbox
  - CSS variables
