# Overview

OpenTelemetry Hapi Instrumentation allows the user to automatically collect trace data and export them to the backend of choice (we can use Zipkin for this example), to give observability to distributed systems.

This is a simple example that demonstrates tracing calls made in a Hapi application. The example shows key aspects of tracing such as
- Root Span (on Client)
- Child Span (on Client)
- Span Attributes
- Instrumentation for routes and request extension points
- Instrumentation of Hapi plugins

## Installation

```sh
$ # from this directory
$ npm install
```

Setup [Zipkin Tracing](https://zipkin.io/pages/quickstart.html)

## Run the Application

### Zipkin

 - Run the server

   ```sh
   # from this directory
   $ npm run server
   ```

 - Run the client

   ```sh
   # from this directory
   npm run client
   ```

#### Zipkin UI
`server` script should output the `traceid` in the terminal (e.g `traceid: 4815c3d576d930189725f1f1d1bdfcc6`).
Go to Zipkin with your browser [http://localhost:9411/zipkin/traces/(your-trace-id)]() (e.g http://localhost:9411/zipkin/traces/4815c3d576d930189725f1f1d1bdfcc6)

<p align="center"><img src="./images/zipkin.jpg?raw=true"/></p>


## Useful links
- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more information on OpenTelemetry for Node.js, visit: <https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-node>

## LICENSE

Apache License 2.0
