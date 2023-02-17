const cds = require('@sap/cds');
const odatav2adapterproxy = require('@sap/cds-odata-v2-adapter-proxy');
// Custom routes handler

cds.on('bootstrap', (app) => {
    //Set custom routes

    //Adapter for OData V2
    app.use(odatav2adapterproxy());
});

module.exports = cds.server;