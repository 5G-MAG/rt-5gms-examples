<p align="center">
  <img src=".github/banner.svg" width="100%" alt="Reference Tools · 5G Media Streaming (5GMS): 5GMS Tools and Examples">
</p>

<p align="center">
  Example projects for testing and developing 5G Media Streaming: a Docker Compose setup of the 5GMS
  components, and a mock 5GMS Application Function with static responses.
</p>

<p align="center">
  <img alt="Status: under development"
    src="https://img.shields.io/badge/Status-Under%20Development-e67e22">
  <a href="https://github.com/5G-MAG/rt-5gms-examples/releases"><img alt="Version"
    src="https://img.shields.io/github/v/release/5G-MAG/rt-5gms-examples?label=Version"></a>
  <a href="License.md"><img alt="License: 5G-MAG Public License v1.0"
    src="https://img.shields.io/badge/License-5G--MAG%20PL%20v1.0-blue"></a>
</p>

<p align="center">
  <a href="https://www.5g-mag.com/reference-tools/5gms/">Project page</a> &nbsp;&middot;&nbsp;
  <a href="https://github.com/5G-MAG/rt-5gms-examples/issues">Issues</a> &nbsp;&middot;&nbsp;
  <a href="https://www.5g-mag.com/contributing">Contributing</a>
</p>

---

## At a glance

|  |  |
|---|---|
| **Part of** | [5G Media Streaming (5GMS)](https://www.5g-mag.com/reference-tools/5gms/), alongside [cmcd-toolkit](https://github.com/5G-MAG/cmcd-toolkit), [rt-5gc-service-consumers](https://github.com/5G-MAG/rt-5gc-service-consumers), [rt-5gms-application](https://github.com/5G-MAG/rt-5gms-application), [rt-5gms-application-function](https://github.com/5G-MAG/rt-5gms-application-function), [rt-5gms-application-provider](https://github.com/5G-MAG/rt-5gms-application-provider), [rt-5gms-application-server](https://github.com/5G-MAG/rt-5gms-application-server), [rt-5gms-common-android-library](https://github.com/5G-MAG/rt-5gms-common-android-library), [rt-5gms-media-session-handler](https://github.com/5G-MAG/rt-5gms-media-session-handler), [rt-5gms-media-stream-handler](https://github.com/5G-MAG/rt-5gms-media-stream-handler), [rt-cmmf-encoder](https://github.com/5G-MAG/rt-cmmf-encoder), [rt-media-origin](https://github.com/5G-MAG/rt-media-origin) |

## Introduction

Example projects that use other 5G-MAG repositories, or add functionality, to test and implement new
5GMS features. Each project has its own folder and README.

More information is on the [project page](https://www.5g-mag.com/reference-tools/5gms/).

### 5G Media Streaming Docker Compose setup

A Docker Compose setup that runs the 5GMS Application Function, the 5GMS Application Server and the
5GMS Application Provider in local containers. It includes a Docker file for each component and
Docker Compose files that connect them. The configuration files can be edited on the host machine and
are mounted into the containers at runtime. See [5gms-docker-setup](./5gms-docker-setup/).

Recipe 1 runs these components either standalone or with an Open5GS 5G Core, for a full end-to-end
setup. See the [Recipe 1 README](./5gms-docker-setup/recipe1/Readme.md).

### Express Mock AF

A simple HTTP server for development, where static responses are enough to implement or test a new
feature. Its routes include:

- `m8.js`: the M8 interface used by the 5GMS-Aware Application; it returns the available services
  and the base URL of the 5GMS Application Function.
- `service-access-information.js`: the Service Access Information for the services returned via M8.

See [express-mock-af](./express-mock-af/).

### Example configuration files

Example 5GMS Application Function configurations are in [examples-files](./examples-files/).

## Downloading

Clone the repository to your home directory:

```bash
cd ~
git clone https://github.com/5G-MAG/rt-5gms-examples.git
```

The path instructions in this repository's documentation assume the repository is at
`~/rt-5gms-examples`.

## Development

### Versioning

The repository version is in the [`VERSION`](./VERSION) file and matches the release tags (format
`rt-5gms-examples-vX.Y.Z`). Bump `VERSION` in the pull request that prepares a release.

## Contributing

Contributions are welcome. How to raise an issue, fork the repository and open a pull request, and
the Contributor License Agreement required before code can be merged, are described at
<https://www.5g-mag.com/contributing>.

## License

Distributed under the 5G-MAG Public License v1.0. See [License.md](License.md).
