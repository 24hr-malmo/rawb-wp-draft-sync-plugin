#!/bin/bash
echo ""
echo "Install pre push hook"

set -e 

echo "make prod" > .git/hooks/pre-push
chmod +x .git/hooks/pre-push

echo "Done"

