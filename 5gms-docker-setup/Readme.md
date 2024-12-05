# 5G Media Streaming - Docker Compose Setup

This project provides a docker-compose setup to run the 5GMS Application Function and the 5GMS Application Server
in a local Docker container environment. The setup includes Docker files for the Application Function and the Application
Server. In addition, it includes a Docker Compose file to
connect the two projects. The configuration files included in this project can be edited on the host machine and
are mounted to the respective Docker container during runtime.

## Installation

Navigate to the `5gms-docker-setup` folder of this repository:

` cd 5gms-docker-setup`

Start Docker Compose to build the containers and start the services:

`docker-compose up`

## Usage

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

## Configuration

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

