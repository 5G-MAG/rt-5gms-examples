#!/usr/bin/env bash
# Substitute (or restore) the <<ADD_YOUR_IP_HERE>> placeholder across
# recipe-cmmf's local configuration files.
#
# Usage: tools/set-ip.sh [IP_ADDRESS] [--dry-run] [--reset]
#
#   IP_ADDRESS   Host IP to substitute. If omitted (and --reset is not
#                given), you will be prompted for it.
#   --dry-run    Show what would change without writing any files.
#   --reset      Restore the <<ADD_YOUR_IP_HERE>> placeholder in all files.
#   -h, --help   Show this help text.
#
# Never commit the substituted (real-IP) versions of these files — run
# with --reset before staging anything.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RECIPE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

MEDIA_CONF="$RECIPE_DIR/configs/media.conf"
INITIAL_CONFIG="$RECIPE_DIR/configs/initial-config.json"
VODCONFIG_TMPL="$RECIPE_DIR/cmmf-origin-public/cmmf/config/vodConfig.json.tmpl"

PLACEHOLDER='<<ADD_YOUR_IP_HERE>>'

usage() {
    sed -n '2,14p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

DRY_RUN=false
RESET=false
IP_ARG=""

for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=true ;;
        --reset) RESET=true ;;
        -h|--help) usage; exit 0 ;;
        -*) echo "Unknown option: $arg" >&2; usage; exit 1 ;;
        *)
            if [[ -n "$IP_ARG" ]]; then
                echo "Error: multiple IP addresses given ('$IP_ARG' and '$arg')." >&2
                exit 1
            fi
            IP_ARG="$arg"
            ;;
    esac
done

if $RESET && [[ -n "$IP_ARG" ]]; then
    echo "Error: --reset does not take an IP address." >&2
    exit 1
fi

for f in "$MEDIA_CONF" "$INITIAL_CONFIG" "$VODCONFIG_TMPL"; do
    if [[ ! -f "$f" ]]; then
        echo "Error: expected file not found: $f" >&2
        exit 1
    fi
done

if $RESET; then
    TARGET="$PLACEHOLDER"
else
    if [[ -z "$IP_ARG" ]]; then
        read -rp "Enter the host machine's IP address: " IP_ARG
    fi
    if [[ -z "$IP_ARG" ]]; then
        echo "Error: no IP address given." >&2
        exit 1
    fi
    TARGET="$IP_ARG"
fi

# Escape any characters in $TARGET that are special to sed's replacement text.
ESCAPED_TARGET="$(printf '%s' "$TARGET" | sed -e 's/[&/\]/\\&/g')"

# Each entry is "file<TAB>sed extended-regex substitution", matching only the
# host portion of each field so the port/suffix around it is preserved and
# the same substitution works whether the current value is an IP or the
# placeholder (i.e. --reset uses this same logic, just with a different target).
SUBSTITUTIONS=(
    "$MEDIA_CONF"$'\t'"s/^(m5_authority = )[^:]+(:.*)\$/\\1${ESCAPED_TARGET}\\2/"
    "$INITIAL_CONFIG"$'\t'"s/(\"domainNameAlias\": \")[^\":]+(:[0-9]+)?(\")/\\1${ESCAPED_TARGET}\\2\\3/g"
    "$VODCONFIG_TMPL"$'\t'"s#(https?://)[^:/\"]+(:[0-9]+__M4_PATH_PREFIX__)#\\1${ESCAPED_TARGET}\\2#g"
)

for entry in "${SUBSTITUTIONS[@]}"; do
    file="${entry%%$'\t'*}"
    expr="${entry#*$'\t'}"
    if $DRY_RUN; then
        echo "--- $file ---"
        diff -u "$file" <(sed -E "$expr" "$file") || true
    else
        sed -i -E "$expr" "$file"
    fi
done

if $DRY_RUN; then
    echo "Dry run only — no files were changed."
elif $RESET; then
    echo "Restored $PLACEHOLDER in:"
    printf '  %s\n' "$MEDIA_CONF" "$INITIAL_CONFIG" "$VODCONFIG_TMPL"
else
    echo "Substituted '$TARGET' in:"
    printf '  %s\n' "$MEDIA_CONF" "$INITIAL_CONFIG" "$VODCONFIG_TMPL"
    echo "Remember: run '$0 --reset' before committing these files."
fi
