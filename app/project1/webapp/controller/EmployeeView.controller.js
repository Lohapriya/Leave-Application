sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
], function (Controller, JSONModel, DateFormat, MessageToast, Dialog, Button, Text) {
    "use strict";

    return Controller.extend("project1.controller.EmployeeView", {
        onInit: function () {
           
            let oViewModel = new JSONModel({
                leaveBalances: {
                    "Annual Leave": 10,
                    "Sick Leave": 5,
                    "Maternity Leave": 15
                }
            });
            this.getView().setModel(oViewModel, "view");

           
            let oData = {
                leaveRecords: [
                    {
                        leaveType: "Annual Leave",
                        startDate: "-",
                        endDate: "-",
                        totalLeave: 10,
                        balanceLeave: 0
                    },
                    {
                        leaveType: "Sick Leave",
                        startDate: "-", 
                        endDate: "-",
                        totalLeave: 5,
                        balanceLeave: 0
                    },
                    {
                        leaveType: "Maternity Leave",
                        startDate: "-",
                        endDate: "-",
                        totalLeave: 15,
                        balanceLeave: 0
                    }
                ]
            };

            let oLeaveModel = new JSONModel(oData);
            this.getView().setModel(oLeaveModel, "leaveRecords");

          
            let aLeaveTypes = [
                { key: "Annual Leave", text: "Annual Leave" },
                { key: "Sick Leave", text: "Sick Leave" },
                { key: "Maternity Leave", text: "Maternity Leave" }
                
            ];
            let oLeaveTypesModel = new JSONModel(aLeaveTypes);
            this.getView().setModel(oLeaveTypesModel, "leaveTypes");
        },

        onApplyLeave: function () {
            let oViewModel = this.getView().getModel("view");
            let oLeaveRecordsModel = this.getView().getModel("leaveRecords");


            let oLeaveTypeSelect = this.getView().byId("leaveType");
            let sLeaveType = oLeaveTypeSelect.getSelectedItem().getText();
            let dStartDate = this.getView().byId("startDate").getDateValue();
            let dEndDate = this.getView().byId("endDate").getDateValue();

            if (!sLeaveType || !dStartDate || !dEndDate) {
                MessageToast.show("Please fill in all fields.");
                return;
            }

            if (dStartDate > dEndDate) {
                MessageToast.show("End Date cannot be earlier than Start Date.");
                return;
            }
            if(dStartDate==dEndDate){
                MessageToast.show("Both Days are same which is invalid");
                return;
            }

            
            let iTotalLeave = Math.ceil((dEndDate - dStartDate) / (1000 * 60 * 60 * 24)); 
            let iCurrentLeaveBalance = oViewModel.getProperty(`/leaveBalances/${sLeaveType}`);

            if (iTotalLeave > iCurrentLeaveBalance) {
                MessageToast.show(`Insufficient leave balance for ${sLeaveType}.`);
                return;
            }

            

            let that = this;
            let oDialog = new Dialog({
                title: "Confirm",
                type: "Message",
                content: new Text({ text: `Are you sure you want to apply for ${iTotalLeave} days of ${sLeaveType}?` }),
                beginButton: new Button({
                    text: "Yes",
                    press: function () {
                        oDialog.close();
                        that._applyLeave(sLeaveType, dStartDate, dEndDate, iTotalLeave);
                    }
                }),
                endButton: new Button({
                    text: "No",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });
            oDialog.open();
        },

        _applyLeave: function (sLeaveType, dStartDate, dEndDate, iTotalLeave) {
            let oViewModel = this.getView().getModel("view");
            let oLeaveRecordsModel = this.getView().getModel("leaveRecords");

           
            let oNewLeaveRecord = {
                leaveType: sLeaveType,
                startDate: this.formatDate(dStartDate),
                endDate: this.formatDate(dEndDate),
                totalLeave: iTotalLeave,
                balanceLeave: oViewModel.getProperty(`/leaveBalances/${sLeaveType}`) - iTotalLeave
            };

            let aCurrentLeaveRecords = oLeaveRecordsModel.getProperty("/leaveRecords");
            aCurrentLeaveRecords.push(oNewLeaveRecord);
            oLeaveRecordsModel.setProperty("/leaveRecords", aCurrentLeaveRecords);

          
            oViewModel.setProperty(`/leaveBalances/${sLeaveType}`, oNewLeaveRecord.balanceLeave);

           
            this.getView().byId("leaveType").setSelectedItem(null);
            this.getView().byId("startDate").setValue(null);
            this.getView().byId("endDate").setValue(null);

          
            MessageToast.show("Leave applied successfully!");
        },

        formatDate: function (dDate) {
            if (!dDate) {
                return "";
            }
            let oDateFormat = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
            return oDateFormat.format(dDate);
        }
    });
});
