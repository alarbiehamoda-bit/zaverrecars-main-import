#!/usr/bin/env bash

set -u

BASE="${BASE:-http://localhost:4101}"
BASE="${BASE%/}"
PASS=0
FAIL=0

fetch() {
  local path="$1"
  local ua="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  RESPONSE="$(curl -sS --compressed --max-time 15 --connect-timeout 5 -A "$ua" -w $'\n__HTTP__%{http_code}' "$BASE$path")" || return 1
  CODE="${RESPONSE##*$'\n'__HTTP__}"
  HTML="${RESPONSE%$'\n'__HTTP__*}"
}

pass() {
  PASS=$((PASS + 1))
  printf '  [PASS] %s\n' "$1"
}

fail() {
  FAIL=$((FAIL + 1))
  printf '  [FAIL] %s\n' "$1"
}

public_route() {
  local path="$1"
  local needle="$2"
  local title="$3"
  local body title_count og_count canonical_count
  if ! fetch "$path"; then fail "$path (curl error)"; return; fi
  body="$(printf '%s' "$HTML" | awk '
    !inside { start = index($0, "<div id=\"root\">"); if (!start) next; inside = 1; $0 = substr($0, start + 15) }
    { state = index($0, "window.__RQ_STATE__"); if (state) { printf "%s", substr($0, 1, state - 1); exit } print }
  ')"
  title_count="$(printf '%s' "$HTML" | sed 's#</head>.*##' | grep -o '<title>' | wc -l | tr -d ' ')"
  og_count="$(printf '%s' "$HTML" | sed 's#</head>.*##' | grep -o 'property="og:title"' | wc -l | tr -d ' ')"
  canonical_count="$(printf '%s' "$HTML" | sed 's#</head>.*##' | grep -o 'rel="canonical"' | wc -l | tr -d ' ')"
  if [ "$CODE" = "200" ] \
    && printf '%s' "$body" | grep -qF -- "$needle" \
    && printf '%s' "$HTML" | grep -qF "<title>$title" \
    && [ "$title_count" = "1" ] \
    && [ "$og_count" = "1" ] \
    && [ "$canonical_count" = "1" ] \
    && printf '%s' "$HTML" | grep -qF 'name="twitter:card"' \
    && ! printf '%s' "$HTML" | grep -io '<meta[^>]*name=.robots.[^>]*>' | grep -qiF 'noindex' \
    && ! printf '%s' "$HTML" | grep -qF '<!--$!-->'; then
    pass "$path"
  else
    fail "$path (status=$CODE, body/head/SEO contract)"
  fi
}

admin_route() {
  if ! fetch "/admin"; then fail "/admin (curl error)"; return; fi
  if [ "$CODE" = "200" ] \
    && printf '%s' "$HTML" | grep -io '<meta[^>]*name=.robots.[^>]*>' | grep -qiF 'noindex'; then
    pass "/admin (noindex)"
  else
    fail "/admin (noindex contract)"
  fi
}

not_found_route() {
  local path="$1"
  if ! fetch "$path"; then fail "$path (curl error)"; return; fi
  if [ "$CODE" = "404" ] \
    && printf '%s' "$HTML" | grep -io '<meta[^>]*name=.robots.[^>]*>' | grep -qiF 'noindex' \
    && ! printf '%s' "$HTML" | grep -qE '<!--app-(html|head)-->'; then
    pass "$path (404 + noindex)"
  else
    fail "$path (404 contract)"
  fi
}

echo "== SSR verification against $BASE =="
public_route "/" "Choose the car." "Luxury Car Rental in Dubai"
public_route "/cars" "Every vehicle currently available" "Luxury &amp; Exotic Car Collection in Dubai"
public_route "/fleet/aston-martin-dbx-707" "Aston Martin DBX 707 is presented" "Aston Martin DBX 707 Rental"
public_route "/journal/ferrari-lamborghini-rental-guide-dubai" "A refined rental begins" "A Practical Guide to Renting"
admin_route
not_found_route "/definitely-not-a-route"
not_found_route "/assets"

echo "== Result: PASS=$PASS FAIL=$FAIL =="
[ "$FAIL" = "0" ]
