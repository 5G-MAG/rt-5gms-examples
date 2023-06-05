# 5GMS Examples

## Introduction

Example projects that make use of other 5G-MAG repositories or provide additional functionality to test and implement
new features for 5GMS.

## Express Mock AF

This project provides a very simple HTTP server that implements two routes.

The first route `m8.js` is used to return
information about the available services and the available base URL to the 5GMS Application Function. The 5GMS-Aware
Application uses this route as M8 interface.

The second route `service-access-information.js` provides the corresponding Service Access Information to the data that
is returned via M8.

This server is intended to be used for development when static responses are enough to implement or test a new feature.
