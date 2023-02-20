const cds = require('@sap/cds');

module.exports = class CatalogService extends cds.ApplicationService {
    init() {
        this.on('READ', 'Customers', this.onCustomersRead);
        return super.init();
    }

    async onCustomersRead(req) {
        const service = await cds.connect.to('db');
        const {Customers, ManualAddedErpIDs, Fba} = this.entities;
        const statusTargetEntity = this.entities.Customers.associations['fbaStatus']._target;
        if (!req?.query?.SELECT?.where) {
            return await service.tx(req).run(req.query); 
        }
        const Topics_ID = req?.query?.SELECT?.where[2].val;
        // const query = SELECT.from(`${Customers.name} as C`)
        //         .columns ('C.name', 'C.ID', 'C.customerId', 'M.manualErpId as erpId', "'' as fbaStatus")
        //         .leftJoin(`${ManualAddedErpIDs.name} as M`)
        //         .on('C.customerId = M.customerId').and('C.erpId = M.erpId')
        //         .where({'C.Topics_ID':Topics_ID});

        const query = cds.parse.cql (`
            SELECT C.name, C.ID, C.customerId,
            CASE
                WHEN S.status = 'Signed' THEN 'Signed'
                ELSE 'Not Signed'
            END AS fbaStatus,
            CASE
                WHEN M.manualErpId != NULL THEN M.manualErpId
                ELSE C.erpId
            END AS erpId
            FROM ${Customers.name} as C
            LEFT JOIN ${ManualAddedErpIDs.name} AS M
            ON C.customerId = M.customerId AND C.erpId = M.erpId
            LEFT JOIN ${statusTargetEntity.name} as S
                ON C.erpId = S.erpId
            WHERE C.Topics_ID = '${Topics_ID}'
        `)

        let result = await service.tx(req).run(query);

        return result;
    }
}