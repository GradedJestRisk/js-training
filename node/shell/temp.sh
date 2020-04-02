#! /usr/bin/bash
FIRST_FILE_NAME="README.md"
cd /tmp
rm -rf git-sandbox
git init git-sandbox
cd git-sandbox
touch $FIRST_FILE_NAME
git add $FIRST_FILE_NAME
git commit -m "Add ${FIRST_FILE_NAME}"
git tag ADD_FIRST_FILE
SECOND_FILE_NAME="foo.bar"
touch $SECOND_FILE_NAME
git add $SECOND_FILE_NAME
git commit -m "Add ${SECOND_FILE_NAME}"
git tag ADD_SECOND_FILE
git reset --hard ADD_FIRST_FILE