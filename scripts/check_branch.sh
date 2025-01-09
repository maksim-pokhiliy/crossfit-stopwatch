#!/bin/bash
if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "Deployment is allowed only from the 'master' branch."
  exit 1
fi

