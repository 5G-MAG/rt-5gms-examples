# 5G Media Streaming - Docker Compose Setup - CMMF Recipe

This project provides a docker-compose setup to run
the [5GMS Application Function](https://github.com/5G-MAG/rt-5gms-application-function),
the [5GMS Application Server](https://github.com/5G-MAG/rt-5gms-application-server) and
the [5GMS Application Provider](https://github.com/5G-MAG/rt-5gms-application-provider)
in a local Docker container environment, extended with **CMMF** (Coded Multisource Media Format,
ETSI TS 103 973 / 3GPP TS 26.512) support for the `CMMFvod` demo stream.

`recipe-cmmf/` is a **standalone sibling** of `../recipe1/` and is self-contained thereafter. Only one recipe (`recipe1` or `recipe-cmmf`)
is expected to run at a time; because of that, `recipe-cmmf` reuses the same host ports
as `recipe1` for the services that overlap (`80`, `3344`, `5555`, `7778`, `8000`, …).

## Architecture

The base architecture matches `recipe1`: 3GPP TS 26.501 A.3 downlink media streaming
with AF and AS in an external Data Network (OTT), exposing reference points `M1`,
`M4`, `M5` and `M8`.

## CMMF architecture

On top of the base recipe, `recipe-cmmf` adds three services to exercise the CMMF
Media Entrypoint flow end-to-end:

- **`cmmf-origin-server`** — a Simple Express Server container hosting the
  CMMF Entry Point JSON at `cmmf/config/vodConfig.json` and, when supplied,
  the CMMF-encoded media under `cmmf/media/`. Reachable inside the compose
  network at `http://cmmf-origin-server:3344/` and, on the host, at
  `http://<host-ip>:3345/` for direct verification.
- **`application-server-cmmf-a`** — a second 5GMS Application Server
  instance exposed on host port `8001`, emulating one CDN backing the
  `CMMFvod` stream.
- **`application-server-cmmf-b`** — a third 5GMS Application Server
  instance exposed on host port `8002`, emulating a second, independent CDN.
- **`application-server-cmmf-c`** — a fourth 5GMS Application Server
  instance exposed on host port `8003`, emulating a third, independent CDN.

The three CMMF Application Server instances pull-ingest from the CMMF origin
via M1 configuration written by `msaf-configuration` (running inside
`application-provider`) from `configs/initial-config.json`. On M8, the resulting
`ServiceListEntry` "VOD: CMMF" carries three entry points with
`contentType: "application/vnd.cmmf-configuration-information+json"`, one
per CDN, matching the `distributionConfigurations[].domainNameAlias`
placeholders `<<ADD_YOUR_IP_HERE>>:8001` / `:8002` / `:8003` in `configs/initial-config.json`.

The overall shape follows the CMMF variant of the recipe1 diagram at
[`img/docker_compose_recipe_cmmf.png`](img/docker_compose_recipe_cmmf.png).

## Required Configuration

Before starting the containers, provide two configuration changes.

Run `tools/set-ip.sh <host-ip>` to substitute `<<ADD_YOUR_IP_HERE>>` in all
three files below in one step (omit the IP to be prompted for it, or use
`--dry-run` to preview the changes first). Run `tools/set-ip.sh --reset`
to restore the placeholders before committing anything.

In `configs/media.conf`, replace `<<ADD_YOUR_IP_HERE>>` with the host machine's IP, e.g.:

````
m5_authority = 10.147.67.219:7778
````

In `configs/initial-config.json`, replace every `<<ADD_YOUR_IP_HERE>>` placeholder with the
host machine's IP. The `CMMFvod` stream carries two aliases with the ports pre-set:

````
"domainNameAlias": "10.147.67.219:8001"
"domainNameAlias": "10.147.67.219:8002"
"domainNameAlias": "10.147.67.219:8003"
````

The other stream (`vodAxinom`) carries one alias
with no port suffix; the default `application-server` on port `80` handles those.

The CMMF Entry Point at `cmmf-origin-public/cmmf/config/vodConfig.json` also
contains `<<ADD_YOUR_IP_HERE>>` placeholders inside its
`serviceLocations[].baseUrl` values. Replace them with the same host IP so the
client-side CMMF Media Access Client can reach the three AS instances directly.

## Optional Configuration

The 5GMS Application Function and 5GMS Application Server configuration files are
`configs/msaf.yaml`, `configs/application-server.conf`, `configs/application-server-cmmf-a.conf`,
`configs/application-server-cmmf-b.conf`, and `configs/application-server-cmmf-c.conf`, mounted into
their respective containers at runtime.

For details on the underlying configuration options, see the
[Application Function](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/usage/application-function/configuration-5GMSAF.html)
and
[Application Server](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/usage/application-server/testing-AS.html#testing)
docs.

The `simple-express-server` continues to host non-CMMF catalogue metadata and
posters from `simple-express-public/` on port `3344`. The new
`cmmf-origin-server` runs an independent instance of the same image against
`configs/cmmf-origin-server.conf`, serving `cmmf-origin-public/` on host port `3345`.

All non-CMMF catalogue files in the `simple-express-public` folder are hosted by the webserver and available at
`http://<YOUR_IP_ADDRESS>:3344/`. 

## Installation

Navigate to the `5gms-docker-setup/recipe-cmmf` folder of this repository:

```
cd 5gms-docker-setup/recipe-cmmf
```

Start Docker Compose to build the containers and start the services. The recipe
ships two compose files: a base file for the four services shared with
`recipe1` and a CMMF overlay that adds the origin and the three emulated CDN
instances. Combine them with `-f`:

```
docker compose -f compose/docker-compose_5gms_without_5GC.yml -f compose/docker-compose-cmmf.yml up
```

## Usage

### msaf-configuration

If `RUN_MSAF_CONFIGURATION_TOOL` is enabled in `compose/docker-compose_5gms_without_5GC.yml`, the `msaf-configuration` tool is executed
when you launch the Docker containers. The
`msaf-configuration` tool uses `configs/initial-config.json` to create provisioning sessions and content hosting
configurations via
the `M1` endpoint of the `Application Function`. It
also creates an `m8.json` that serves as the starting point for the 5GMS Aware Application. For details refer to
the [Tutorial - 5GMSd: Basic end to end setup](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/tutorials/end-to-end.html)

### Placing CMMF-encoded media

Drop the CMMF-encoded content into
`cmmf-origin-public/cmmf/media/`. The seeded `vodConfig.json.tmpl` references a
manifest at `media/manifest.mpd` relative to the origin root; adjust that
`applicationResourceLocators[0].locator` if the encoder produces a different
filename.

`vodConfig.json` itself is **generated**, not static: `application-provider`'s
`msaf-configuration` tool renders it from `vodConfig.json.tmpl` via `CmmfVodConfigFormatter`
(a registered `M8Output`, see `configs/media.conf`'s `m8outputs` setting), in the same
M1-sync step that writes `m8.json` — substituting the live `/m4d/provisioning-session-<id>/`
prefix taken directly from the resolved distribution base URL into every
`applicationResourceLocators[].locator` and `applicationResourceConfigurations[].serviceLocations[].baseUrl`
field, in place of the `__M4_PATH_PREFIX__` placeholder. **Always edit `vodConfig.json.tmpl`**,
never the generated `vodConfig.json` (it's gitignored and gets overwritten on every
`docker compose up`), and leave the `__M4_PATH_PREFIX__` placeholder as-is.

The formatter matches the `CMMFvod` stream's entry point via its content type
(`application/vnd.cmmf-configuration-information+json`).

### Metadata for 5GMS Aware Application

`simple-express-public/metadata.json` and `simple-express-public/posters/`
continue to serve the catalogue metadata used by the 5GMS Aware Application,
exactly as in `recipe1`.

### Management UI

If `RUN_MANAGEMENT_UI` in `compose/docker-compose_5gms_without_5GC.yml` is set to `true`, the 5GMS Application Provider Management UI is
started and available at `http://127.0.0.1:8000/`.

### External REST client

The AF and AS ports are exposed on the host:

* Application Function `M1` interface: `5555`
* Application Function `M5` interface: `7778`
* Application Server `M4` interface (default): `80`
* Application Server `M4` interface (CMMF CDN A): `8001`
* Application Server `M4` interface (CMMF CDN B): `8002`
* Application Server `M4` interface (CMMF CDN C): `8003`
* CMMF origin (direct): `3345`
* Catalogue metadata (Simple Express Server): `3344`

Example: fetching the CMMF Entry Point JSON directly from the origin:

```
curl http://<host-ip>:3345/cmmf/config/vodConfig.json
```

Or via one of the AS instances (once `msaf-configuration` has provisioned it):

```
curl http://<host-ip>:8001/m4d/provisioning-session-<id>/cmmf/config/vodConfig.json
curl http://<host-ip>:8002/m4d/provisioning-session-<id>/cmmf/config/vodConfig.json
curl http://<host-ip>:8003/m4d/provisioning-session-<id>/cmmf/config/vodConfig.json
```

## Tearing down

Stop the recipe with the same compose files used to start it — the base file and the CMMF overlay:

`docker compose -f compose/docker-compose_5gms_without_5GC.yml -f compose/docker-compose-cmmf.yml down`

`shared/` and `af-reports/` are host bind mounts, not Docker-managed volumes, so `down` (with or without `-v`) leaves
them in place. Delete their contents manually if you want a clean slate for the next run.

## FAQ

### `m8.json` is not created

Error message: ` FileNotFoundError: [Errno 2] No such file or directory: '/shared/<<SOME_IP>>/m8.json'`

If you run into an issue where the `m8.json` is not created, make sure that the right folders are created inside the
`shared`
folder. There should be a `localhost` folder, and inside that folder, there should be a `m8.json` file. In addition, a
similar folder with the IP of your host machine should be created. It also contains an `m8.json` file.

If one or both of these folders are missing, create them manually and re-run the compose command above.

### The `CMMFvod` stream returns no entry points on M8

Check that the `cmmf-origin-server` service is healthy and that
`configs/initial-config.json`'s `streams.CMMFvod.ingestURL` still points at
`http://cmmf-origin-server:3344/` — if it was edited to a host-facing URL,
the AS containers inside the compose network cannot resolve it.

### `vodConfig.json`'s `baseUrl`/`locator` fields 404 when fetched through `application-server-cmmf-*`

`vodConfig.json` is generated from `vodConfig.json.tmpl` by `application-provider`'s
`msaf-configuration` tool (see "Placing CMMF-encoded media" above), synchronously with `m8.json`.
Diagnosing a 404 response code:

- Confirm `vodConfig.json.tmpl` exists under `cmmf-origin-public/cmmf/config/` and that
  `application-provider` has write access to that directory (`compose/docker-compose-cmmf.yml`'s
  `application-provider` mount).
- Confirm with `curl http://<host-ip>:3345/cmmf/config/vodConfig.json` that the served
  `baseUrl`/`locator` fields actually contain a `/m4d/provisioning-session-<id>/` segment matching
  the `CMMFvod` entry in `curl http://<host-ip>:8000/m8.json`.
