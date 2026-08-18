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

The two CMMF Application Server instances pull-ingest from the CMMF origin
via M1 configuration written by `msaf-configuration` (running inside
`application-provider`) from `initial-config.json`. On M8, the resulting
`ServiceListEntry` "VOD: CMMF" carries two entry points with
`contentType: "application/vnd.cmmf-configuration-information+json"`, one
per CDN, matching the `distributionConfigurations[].domainNameAlias`
placeholders `<YOUR_MACHINE_IP_HERE>:8001` / `:8002` in `initial-config.json`.

The overall shape follows the CMMF variant of the recipe1 diagram at
[`../recipe1/img/docker_compose_recipe_cmmf.png`](../recipe1/img/docker_compose_recipe_cmmf.png).

## Required Configuration

Before `docker compose up`, provide two configuration changes.

In `media.conf`, replace `<<ADD_YOUR_IP_HERE>>` with the host machine's IP, e.g.:

````
m5_authority = 10.147.67.219:7778
````

In `initial-config.json`, replace every `<YOUR_MACHINE_IP_HERE>` placeholder with the
host machine's IP. The `CMMFvod` stream carries two aliases with the ports pre-set:

````
"domainNameAlias": "10.147.67.219:8001"
"domainNameAlias": "10.147.67.219:8002"
````

The other streams (`vodBBC`, `vodAxinom`, `livesim5GMAG`) each carry one alias
with no port suffix; the default `application-server` on port `80` handles those.

The CMMF Entry Point at `cmmf-origin-public/cmmf/config/vodConfig.json` also
contains `<YOUR_MACHINE_IP_HERE>` placeholders inside its
`serviceLocations[].baseUrl` values. Replace them with the same host IP so the
client-side CMMF Media Access Client can reach the two AS instances directly.

## Optional Configuration

The 5GMS Application Function and 5GMS Application Server configuration files are
`msaf.yaml`, `application-server.conf`, `application-server-cmmf-a.conf`, and
`application-server-cmmf-b.conf`, mounted into their respective containers at runtime.

For details on the underlying configuration options, see the
[Application Function](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/usage/application-function/configuration-5GMSAF.html)
and
[Application Server](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/usage/application-server/testing-AS.html#testing)
docs.

The `simple-express-server` continues to host non-CMMF catalogue metadata and
posters from `simple-express-public/` on port `3344`. The new
`cmmf-origin-server` runs an independent instance of the same image against
`cmmf-origin-server.conf`, serving `cmmf-origin-public/` on host port `3345`.

## Installation

Navigate to the `5gms-docker-setup/recipe-cmmf` folder of this repository:

```
cd 5gms-docker-setup/recipe-cmmf
```

Start Docker Compose to build the containers and start the services:

```
docker compose up
```

## Usage

### msaf-configuration

If `RUN_MSAF_CONFIGURATION_TOOL` is enabled in the `docker-compose.yaml` , the `msaf-configuration` tool is executed
when you launch the Docker containers via `docker compose up`. The
`msaf-configuration` tool uses the `initial-config.json` to create provisioning sessions and content hosting
configurations via
the `M1` endpoint of the `Application Function`. It
also creates an `m8.json` that serves as the starting point for the 5GMS Aware Application. For details refer to
the [Tutorial - 5GMSd: Basic end to end setup](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/tutorials/end-to-end.html)

### Placing CMMF-encoded media

Drop the CMMF-encoded content into
`cmmf-origin-public/cmmf/media/`. The seeded `vodConfig.json` references a
manifest at `media/manifest.mpd` relative to the origin root; adjust that
`applicationResourceLocators[0].locator` if the encoder produces a different
filename.

### Metadata for 5GMS Aware Application

`simple-express-public/metadata.json` and `simple-express-public/posters/`
continue to serve the catalogue metadata used by the 5GMS Aware Application,
exactly as in `recipe1`.

### Management UI

If `RUN_MANAGEMENT_UI` in the `docker-compose.yaml` is set to `true`, the 5GMS Application Provider Management UI is
started and available at `http://127.0.0.1:8000/`.

### External REST client

The AF and AS ports are exposed on the host:

* Application Function `M1` interface: `5555`
* Application Function `M5` interface: `7778`
* Application Server `M4` interface (default): `80`
* Application Server `M4` interface (CMMF CDN A): `8001`
* Application Server `M4` interface (CMMF CDN B): `8002`
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
```

## FAQ

### `m8.json` is not created

Error message: ` FileNotFoundError: [Errno 2] No such file or directory: '/shared/<<SOME_IP>>/m8.json'`

If you run into an issue where the `m8.json` is not created, make sure that the right folders are created inside the
`shared`
folder. There should be a `localhost` folder, and inside that folder, there should be a `m8.json` file. In addition, a
similar folder with the IP of your host machine should be created. It also contains an `m8.json` file.

If one or both of these folders are missing, create them manually and run `docker compose up` again.

### The `CMMFvod` stream returns no entry points on M8

Check that the `cmmf-origin-server` service is healthy and that
`initial-config.json`'s `streams.CMMFvod.ingestURL` still points at
`http://cmmf-origin-server:3344/` — if it was edited to a host-facing URL,
the AS containers inside the compose network cannot resolve it.
