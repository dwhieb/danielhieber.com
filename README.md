# [danielhieber.com](https://danielhieber.com)

The academic homepage of Daniel W. Hieber, graduate student in linguistics at the University of California, Santa Barbara.

# Maintenance

* Keep a continuous `dev` branch.
* Only use Squash & Merge commits for the `master` branch.
* Do not allow commits to the `master` branch without an override.

1. [Open issues][1]
1. Add labels and details to issues
1. Triage issues on the [project board][2]
1. Select an issue to work on
1. Create issue branch (from `dev`)
1. Update dependencies
  - npm
  - Node
  - npm packages
  - other 3rd party scripts
1. Add item to test checklist
1. Write code
1. Update inline code commenting
  - Prefer Handlebars comments for HTML
1. Build
  - transpile JS
  - compile LESS
1. Go through [checklists][3]
1. Run through tests in each browser
  - Chrome (desktop)
  - Chrome (mobile)
  - Safari (deskop)
  - Safari (mobile)
  - Edge (desktop)
  - Edge (mobile)
  - Firefox (desktop)
  - Firefox (mobile)
1. Open pull request into `dev` branch
1. Squash & merge pull request
  - Add commit message that closes issue
1. Repeat tests on dev server
1. Open pull request to `master` branch
1. Squash & merge pull request
1. Repeat testing on production server
1. Close issue

[1]: https://github.com/dwhieb/danielhieber.com/issues
[2]: https://github.com/dwhieb/danielhieber.com/projects/3
[3]: https://github.com/dwhieb/utilities/tree/master/checklists
