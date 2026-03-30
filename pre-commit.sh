#!/bin/sh

if ! pnpm fmt:check; then
  exit 1;
fi

if ! pnpm lint; then
  exit 1;
fi

if ! pnpm check; then
  exit 1;
fi

# echo "Running tests..."
# if ! pnpm test; then
#   exit 1;
# fi
