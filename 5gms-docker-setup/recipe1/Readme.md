# 5G Media Streaming - Docker Compose Setup - Recipe 1

This project provides a docker-compose setup to run
the [5GMS Application Function](https://github.com/5G-MAG/rt-5gms-application-function),
the [5GMS Application Server](https://github.com/5G-MAG/rt-5gms-application-server) and
the [5GMS Application Provider](https://github.com/5G-MAG/rt-5gms-application-provider)
in a local Docker container environment.

For that reason, this folder includes Docker files for all the three aforementioned projects. In addition, it includes a
`docker-compose.yaml` file to connect the three projects. The configuration files included in this project can be edited
on the
host machine and
are mounted to the respective Docker container during runtime.

## Architecture

The architecture of this Docker setup corresponds to 3GPP TS 26.501 A.3: Downlink media streaming with both AF and AS
deployed in an external Data Network (OTT). The Docker compose file starts all Docker containers on a single machine
and exposes reference points `M4` and `M5`.

## Required Configuration

### Configuration files

You need to provide two configuration changes to the `af-sync.conf` and the `streams.json` file.

In `af-sync.conf` add the IP of your host machine by replacing `<<ADD_YOUR_IP_HERE>>` e.g.:

````
m5_authority = 10.147.67.219:7778
````

In `streams.json` add the IP of your host machine by replacing `<<ADD_YOUR_IP_HERE>>` e.g.:

````
"domainNameAlias": "10.147.67.219"
````

These changes enable a 5G Media Streaming client to access the content via the `M4` interface exposed by the
`Application Server` on the host machine.

## Optional Configuration

The configuration files for the 5GMS Application Function and the 5GMS Application Server are located in `msaf.yaml` and
`application-server.conf` respectively. The configuration files are mounted to the respective Docker container during
runtime.

By default, the M1 and M5 interface of the Application Function run on ports
`5555` and `7778` and are exposed to the host machine.

The Application Server runs on port `80` which is also available on the host machine.

For details on the configuration options, please refer to our documentation of
the [Application Function](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/usage/application-function/configuration-5GMSAF.html)
and
the [Application Server](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/usage/application-server/testing-AS.html#testing).

## Installation

Navigate to the `5gms-docker-setup/recipe1` folder of this repository:

` cd 5gms-docker-setup/recipe1`

Start Docker Compose to build the containers and start the services:

`docker compose up`

## Usage

### msaf-configuration

If `RUN_MSAF_CONFIGURATION_TOOL` is enabled in the `docker-compose.yaml` , the `msaf-configuration` tool is executed
when you launch the Docker containers via `docker compose up`. The
`msaf-configuration` tool uses the `streams.json` to create provisioning sessions and content hosting configurations via
the `M1` endpoint of the `Application Function`. It
also creates an `m8.json` that serves as the starting point for the 5GMS Aware Application. For details refer to
the [Tutorial - 5GMSd: Basic end to end setup](https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/tutorials/end-to-end.html)

### Management UI

If `RUN_MANAGEMENT_UI` in the `docker-compose.yaml` is set to `true`, the 5GMS Application Provider Management UI is
started and available at `http://127.0.0.1:8000/`.

### External REST client

After the containers are built and started, the 5GMS Application Function and the 5GMS Application Server are available
via the host machine. As an example, running the following curl command will create a provisioning session via the `M1`
interface of the Application Function:

````shell
curl -X POST http://localhost:5555/3gpp-m1/v2/provisioning-sessions \
     -H "Content-Type: application/json" \
     -d '{
           "aspId": "aspId",
           "appId": "appId",
           "provisioningSessionType": "DOWNLINK"
         }'
        
````

By default the following ports are exposed to the host machine:

* Application Function `M1` interface: Port `5555`
* Application Function `M5` interface: Port `7778`
* Application Server `M4` interface: Port `80`

## FAQ

### `m8.json` is not created

Error message: ` FileNotFoundError: [Errno 2] No such file or directory: '/shared/<<SOME_IP>>/m8.json'`

If you run into an issue where the `m8.json` is not created, make sure that the right folders are created inside the
`shared`
folder. There should be a `localhost` folder, and inside that folder, there should be a `m8.json` file. In addition, a
similar folder with the IP of your host machine should be created. It also contains an `m8.json` file.

If one or both of these folders are missing, create them manually and run `docker compose up` again.
