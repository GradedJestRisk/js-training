const trace = async function ({knexMonitoring, correlationId, routeId, requestId}) {

   await insertCorrelation({knexMonitoring, correlationId});

   const insertQuery = `INSERT INTO request (id, route_id, correlation_id)
                        VALUES ('${requestId}', '${routeId}','${correlationId}')`;
   await knexMonitoring.raw(insertQuery);
}

const insertCorrelation = async function ({knexMonitoring, correlationId}) {
   const insertQuery = `INSERT INTO correlation (id, text)
                        VALUES ('${correlationId}','request') ON CONFLICT ON CONSTRAINT correlation_pkey DO NOTHING;`;
   await knexMonitoring.raw(insertQuery);
}

module.exports = {trace}
