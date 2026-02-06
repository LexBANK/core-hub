#!/usr/bin/env bash
set -euo pipefail

npx --yes @openapitools/openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-fetch \
  -o sdk/typescript
