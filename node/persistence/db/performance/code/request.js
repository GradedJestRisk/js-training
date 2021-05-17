const trace = async function ({knexMonitoring, correlationId, routeId, requestId, version}) {
   await insertCorrelation({knexMonitoring, correlationId});
   await insertRequest({knexMonitoring, correlationId, routeId, requestId, version});
}

const insertCorrelation = async function ({knexMonitoring, correlationId}) {
   const insertQuery = `INSERT INTO correlation (id, text)
                        VALUES ('${correlationId}','request') ON CONFLICT ON CONSTRAINT correlation_pkey DO NOTHING;`;
   await knexMonitoring.raw(insertQuery);
}

const insertRequest = async function ({knexMonitoring, correlationId, routeId, requestId, version}) {
   const insertQuery = `INSERT INTO request (id, route_id, correlation_id, version_id)
                        VALUES ('${requestId}', '${routeId}','${correlationId}','${version}')`;
   await knexMonitoring.raw(insertQuery);
}

const markRequestAsFinished = async function ({knexMonitoring, requestId}) {
   const updateQuery = `UPDATE request SET ended_at = NOW() WHERE id= '${requestId}'`;
   await knexMonitoring.raw(updateQuery);
}

module.exports = {trace, markRequestAsFinished}
