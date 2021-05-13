require('dotenv').config()
const Sentry = require("@sentry/node");

Sentry.init({
   dsn: process.env.SENTRY_DSN,
   tracesSampleRate: 1.0,
});

try {
   // throw new Error(foo);
   foo();
} catch (error) {
   Sentry.captureException(error);
}
