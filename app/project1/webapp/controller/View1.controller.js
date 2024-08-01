sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel"
], function (Controller, ODataModel) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function () {
            let oDataModel = new ODataModel({
                serviceUrl: "/odata/v4/catalog/"
            });
            this.getView().setModel(oDataModel);
        },
        
        onItemPress: function (oEvent) {
            let oItem = oEvent.getSource();
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            let sPath = oItem.getBindingContext().getPath();
            let sEmployeeemail = sPath.split("(")[1].split(")")[0];
            oRouter.navTo("employee", {
                employeeemail: sEmployeeemail
            });
        }
    });
});
