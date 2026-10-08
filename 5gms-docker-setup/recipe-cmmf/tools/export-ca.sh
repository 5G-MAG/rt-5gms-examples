#!/usr/bin/env bash
# Export the local CA certificate that signs the Application Servers' HTTPS
# certificates, so clients can trust all of them with a single file.
#
# Usage: tools/export-ca.sh
#
# Reads m1-client-data/ca-public.json (written by the application-provider
# once the stack has provisioned its first certificate) and writes the PEM to
# certs/local-ca.pem.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RECIPE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

CA_JSON="$RECIPE_DIR/m1-client-data/ca-public.json"
OUT_DIR="$RECIPE_DIR/certs"
OUT_PEM="$OUT_DIR/local-ca.pem"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
    sed -n '2,10p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
    exit 0
fi

if [[ ! -f "$CA_JSON" ]]; then
    echo "Error: $CA_JSON not found." >&2
    echo "Start the stack and wait for the application-provider to provision the HTTPS distributions first." >&2
    exit 1
fi

mkdir -p "$OUT_DIR"
# ca-public.json holds the PEM as a single JSON-encoded string.
python3 -c 'import json,sys; sys.stdout.write(json.load(sys.stdin))' < "$CA_JSON" > "$OUT_PEM"

echo "Wrote $OUT_PEM"
openssl x509 -in "$OUT_PEM" -noout -subject -enddate -fingerprint -sha256
echo
echo "Example: curl --cacert $OUT_PEM --http2 https://<ip>:9001/<path>"
