const api = require('@opentelemetry/api')
const { NodeTracerProvider } = require('@opentelemetry/node')
const { SimpleSpanProcessor } = require('@opentelemetry/tracing')
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin')

module.exports = (serviceName) => {
   const provider = new NodeTracerProvider({
      plugins: {
         knex: {
            path: '@myrotvorets/opentelemetry-plugin-knex',
         },
         // Add other plugins as needed
         http: {},
         https: {},
      },
   })

// Add exporters as needed
   const zipkinExporter = new ZipkinExporter({
      //url: 'http://localhost:9411/api/v2/spans',
      serviceName,
   })

   const zipkinProcessor = new SimpleSpanProcessor(zipkinExporter)
   provider.addSpanProcessor(zipkinProcessor)

   // Go!
   provider.register()

   return api.trace.getTracer('statements')
}
