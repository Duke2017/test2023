sap.ui.define(
    ["./BaseController"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.ciw.ui.controller.MainView", {
            onInit: function () {},

            onListItemPress: function (oE) {
                const id = oE.getSource().getBindingContext().getProperty("ID");
                this.getRouter().navTo("DetailPage", {id});
            }
        });
    }
);
