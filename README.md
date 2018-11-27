# Issues

## Submitting issues

Submit an issue on Github. Be as descriptive as possible and fill as much of the template as possible. 

Then add a projects and bug label. Add the [dev.inyo.me](http://dev.inyo.me) or [beta.inyo.me](http://beta.inyo.me) label depending on where you discovered the bug.

Then assign it to FranzPoize.

## Fixing issues

When you commit to fix an issue add fix #ISSUE_NUMBER to your commit. Label the issue has fixed.

# Deployment

## Targets

Deployment is done automatically on push. This is the list of targets per branch:

- develop → https://dev.inyo.me
- release → https://beta.inyo.me
- master → https://app.inyo.me

# Installation

## Requirements

You will need to install node v10. Best way is to install nvm then install node v10. see [https://github.com/creationix/nvm](https://github.com/creationix/nvm) for help.
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
nvm install v10
nvm alias default v10
nvm use v10
```
To automatically set up nvm see [https://github.com/creationix/nvm#deeper-shell-integration](https://github.com/creationix/nvm#deeper-shell-integration)

## Running inyo
```bash
git clone git@github.com:byte-foundry/inyo.git
cd inyo
yarn
yarn start
```
