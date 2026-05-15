#!/bin/sh
set -eu

CONFIG_FILE="/etc/5gmag/ses/conf/simple-express-server.conf"
DEFAULT_PORT="3000"

PORT="$DEFAULT_PORT"

if [ -f "$CONFIG_FILE" ]; then
  CONFIGURED_PORT="$(awk -F '=' '
    /^[[:space:]]*port[[:space:]]*=/ {
      value = $2
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
      print value
      exit
    }
  ' "$CONFIG_FILE")"

  if [ -n "$CONFIGURED_PORT" ]; then
    PORT="$CONFIGURED_PORT"
  fi
fi

export PORT
exec npm start

