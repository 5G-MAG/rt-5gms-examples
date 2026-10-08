# CMMF media root

Real CMMF-encoded media content to be added here — external dependency,
not yet supplied.

The CMMF Entry Point at `../config/vodConfig.json` references a manifest
at `media/manifest.mpd` relative to the origin root; drop the CMMF-encoded
DASH/HLS output (manifest + segments) into this directory when it becomes
available so the AS containers can pull-ingest it from
`http://cmmf-origin-server:3344/cmmf/media/`.
