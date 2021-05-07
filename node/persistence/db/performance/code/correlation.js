const insertCorrelation = async function ({knexMonitoring, correlationId}) {
   const insertQuery = `INSERT INTO correlation (id, text)
                        VALUES ('${correlationId}','request') ON CONFLICT ON CONSTRAINT correlation_pkey DO NOTHING;`;
   await knexMonitoring.raw(insertQuery);
}

module.exports = {insertCorrelation}
