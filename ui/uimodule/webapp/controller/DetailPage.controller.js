sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    'sap/m/MessageBox',
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV"],
    function (Controller,Filter,MessageBox,Export,ExportTypeCSV) {
        "use strict";

        return Controller.extend("com.sap.ciw.ui.controller.DetailPage", {
            onInit: function () {
                this.getRouter().getRoute("DetailPage").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oE) {
                const id = oE.getParameter("arguments").id;
                const oBinding = this.byId("detailPageId").getBinding("items");
                oBinding.filter( new Filter("Topics_ID", "EQ", id) );
            },

            onDataExport : function() {
                const oExport = new Export({
                    exportType : new ExportTypeCSV({
                        separatorChar : ";"
                    }),
    
                    // Pass in the model created above
                    models : this.getView().getModel(),
    
                    // binding information for the rows aggregation
                    rows : {
                        path : "/Customers"
                    },
    
                    // column definitions with column name and binding info for the content
    
                    columns : [{
                        name : "name",
                        template : {
                            content : "{name}"
                        }
                    }, {
                        name : "customerId",
                        template : {
                            content : "{customerId}"
                        }
                    }, {
                        name : "erpId",
                        template : {
                            content : "{erpId}"
                        }
                    }, {
                        name : "FbaStatus",
                        template : {
                            content : "{FbaStatus}"
                        }
                    }]
                });
    
                // download exported file
                oExport.saveFile().catch(function(oError) {
                    MessageBox.error("Error when downloading data.\n\n" + oError);
                }).then(function() {
                    oExport.destroy();
                });
            }
        });
    }
);
