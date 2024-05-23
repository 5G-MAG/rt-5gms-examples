<h1 align="center">5GMS Examples</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Status-Under_Development-yellow" alt="Under Development">
  <img src="https://img.shields.io/github/v/tag/5G-MAG/rt-5gms-examples?label=version" alt="Version">
  <img src="https://img.shields.io/badge/License-5G--MAG%20Public%20License%20(v1.0)-blue" alt="License">
</p>

## Introduction

Example projects that make use of other 5G-MAG repositories or provide additional functionality to test and implement
new features for 5GMS.

Additional information can be found at: https://5g-mag.github.io/Getting-Started/pages/5g-media-streaming/

## Express Mock AF

This project provides a very simple HTTP server that implements two routes.

The first route `m8.js` is used to return
information about the available services and the available base URL to the 5GMS Application Function. The 5GMS-Aware
Application uses this route as M8 interface.

The second route `service-access-information.js` provides the corresponding Service Access Information to the data that
is returned via M8.

This server is intended to be used for development when static responses are enough to implement or test a new feature.
