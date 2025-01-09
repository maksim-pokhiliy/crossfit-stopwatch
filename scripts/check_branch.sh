#!/bin/bash
if [ "$(git rev-parse --abbrev-ref HEAD)" != "dev" ]; then
  echo "Deployment is allowed only from the 'dev' branch."
  exit 1
fi
