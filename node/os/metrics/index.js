const {collectDefaultMetrics, register} = require('prom-client');

collectDefaultMetrics({
   timeout: 10000,
   gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
});

(
   async () => {
      const metrics = await register.metrics()
      console.log(metrics);
   })()
