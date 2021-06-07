'use strict'

const api = require('@opentelemetry/api')
const { NodeTracerProvider } = require('@opentelemetry/node')
const { SimpleSpanProcessor } = require('@opentelemetry/tracing')
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin')
const { HapiInstrumentation } = require('@opentelemetry/instrumentation-hapi')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')

module.exports = (serviceName) => {
   const provider = new NodeTracerProvider()

   const exporter = new ZipkinExporter({ serviceName })
   provider.addSpanProcessor(new SimpleSpanProcessor(exporter))

   // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
   provider.register()

   registerInstrumentations({
      instrumentations: [
         new HapiInstrumentation({
            enhancedDatabaseReporting: true,
         }),
         new HttpInstrumentation(),
      ],
   })

   return api.trace.getTracer('hapi-example')
}
