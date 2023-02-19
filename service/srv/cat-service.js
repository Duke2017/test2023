const cds = require('@sap/cds');

module.exports = class CatalogService extends cds.ApplicationService {
    init() {
        this.on('READ', 'Customers', this.onCustomersRead);
        return super.init();
    }

    async onCustomersRead(req) {
        const service = await cds.connect.to('db');
        const {Customers, ManualAddedErpIDs, Fba} = this.entities;
        if (!req?.query?.SELECT?.where) {
            return await service.tx(req).run(req.query); 
        }
        const Topics_ID = req?.query?.SELECT?.where[2].val;
        const query = SELECT.from(`${Customers.name} as C`)
                .columns ('C.name', 'C.ID', 'C.customerId', 'M.manualErpId as erpId2', 'C.erpId')
                .leftJoin(`${ManualAddedErpIDs.name} as M`)
                .on('C.customerId = M.customerId').and('C.erpId = M.erpId')
                .where({'C.Topics_ID':Topics_ID})
        let result = await service.tx(req).run(query);
        result = result.map((elem) => {
            if (elem.erpId2) {
                elem.erpId = elem.erpId2;
            }
            return elem;
        })
        return result;
    }
}