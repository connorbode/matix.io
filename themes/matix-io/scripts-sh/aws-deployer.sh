#!/bin/bash
if [ -f .env ]; then
	source .env
fi
aws s3 sync public s3://matix.io --acl public-read --delete --size-only