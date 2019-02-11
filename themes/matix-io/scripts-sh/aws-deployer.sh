#!/bin/bash
if [ -f .env ]; then
	shopt -s expand_aliases
	source .env
fi
aws s3 sync public s3://matix.io --acl public-read --delete --size-only