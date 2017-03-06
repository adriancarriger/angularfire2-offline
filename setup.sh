#!/bin/bash
echo What is your issue name?
read ISSUE_NAME
echo -e '**************************************************************************\n'\
'**Setting up new issue: '$ISSUE_NAME'\n'

rm -rf base/angular-cli/node_modules
cp -r base/angular-cli issues/$ISSUE_NAME/
ISSUE_LINK='https://adriancarriger.github.io/angularfire2-offline/issues/'${ISSUE_NAME}'/dist'

ISSUE_MESSAGE='# Issue: '${ISSUE_NAME}'\n\n**After adding to the remote gh-pages branch this version will be visible at: \n\n'${ISSUE_LINK}'\n\n## You can test locally by running:\ncd issues/'${ISSUE_NAME}'\nnpm run static-serve\n'

(cd issues/${ISSUE_NAME} \
  && npm install \
  && npm run build:prod \
  && echo -e $ISSUE_MESSAGE | tee README.md)
