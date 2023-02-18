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
        let query = SELECT.from(`${Customers.name} as C`)
                .columns ('C.name', 'C.ID', 'C.customerId', 'M.manualErpId as erpId2', 'C.erpId')
                .join(`${ManualAddedErpIDs.name} as M`)
                .on('C.customerId = M.customerId').and('C.erpId = M.erpId')
                .where({'C.Topics_ID':Topics_ID})
                // case
                // .columns ('F.status as fbaStatus').join(`${Fba.name} as F`)
                // .on('C.erpId = F.erpId')
        query.SELECT.from.join = 'left';
        
         let result = await service.tx(req).run(query);
         result = result.map((elem) => {
            if (elem.erpId2) {
                elem.erpId = elem.erpId2;
            }

            return elem
         })
         return result;
    }
}