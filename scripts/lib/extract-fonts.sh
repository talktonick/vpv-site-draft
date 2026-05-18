#!/usr/bin/env bash
# One-off: extract base64 TTF payloads out of vv-sandbox.html into assets/fonts/.
# Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")/../.."

declare -a MAP=(
  "11:neue-haas-light.ttf"
  "18:neue-haas-regular.ttf"
  "25:neue-haas-italic.ttf"
  "32:neue-haas-medium.ttf"
  "39:neue-haas-bold.ttf"
  "46:victor-serif-light.ttf"
  "53:victor-serif-light-italic.ttf"
)

for entry in "${MAP[@]}"; do
  line="${entry%%:*}"
  out="assets/fonts/${entry##*:}"
  awk -v L="$line" 'NR==L' vv-sandbox.html \
    | sed -E 's/.*base64,([A-Za-z0-9+/=]+).*/\1/' \
    | base64 -D > "$out"
  printf '%s (%s bytes)\n' "$out" "$(wc -c < "$out")"
done
