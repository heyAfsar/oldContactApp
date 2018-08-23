sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/sap/ContactApp/ContactApp/model/models",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, models, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.sap.ContactApp.ContactApp.controller.homeView", {
		onInit: function(){
			this.mockModel = models.getMockData();
			this.getView().setModel(this.mockModel, "mockModel");
			
			var oView = this.getView();
			oView.setModel(new sap.ui.model.json.JSONModel({
				globalFilter: "",
				availabilityFilterOn: false,
				cellFilterOn: false
			}), "ui");
			
			this._oGlobalFilter = null;
			this._oPriceFilter = null;
		},
		count: function(oValue){
			//return this.getView().getModel("mockModel").oData.length;
			return oValue.length;
		},
		
		////////////////edit popup & functionality////////////////
		onEdit: function(oEvent) {
			if (this.pressEdit) {
				this._OhandleEdit();
			}
			//var oObject = oEvent.getSource().getParent().getBindingContext("regionList").getObject();
			if (!this.pressEdit) {
				this.pressEdit = sap.ui.xmlfragment("com.sap.ContactApp.ContactApp..view.edit", this);
				this.getView().addDependent(this.pressEdit);
			}
			this.pressEdit.open();
			
			var name = oEvent.getSource().getParent().getCells()[0].getText();
			var phone = oEvent.getSource().getParent().getCells()[1].getText();
			
			sap.ui.getCore().byId("name").setValue(name);
			sap.ui.getCore().byId("contact").setValue(phone);
			//sap.ui.getCore().byId("stcode").setValue(oObject.stCode);
			//sap.ui.getCore().byId("usertpp").setValue(oObject);
		},
		
		/*Triggered on click of cancel in edit window*/
		onCancelEdit: function(oEvent) {
			this._OhandleEdit();
		},

		/*Saves the updated UserTPP through put ajax call*/
		onSaveEdit: function(oEvent) {
		},
		
		_OhandleEdit: function() {
			//sap.ui.getCore().byId("usertpp").setValue("");
			//sap.ui.getCore().byId("CB1").setSelectedKey("");
			this.pressEdit.close();
		},
		
		//global search
			filterGlobally: function (oEvent) {
			var z = oEvent.getSource().sId;
			this.curTable = sap.ui.getCore().byId(z).getParent().getParent().sId;
			var sQuery = oEvent.getParameter("query");
			this._oGlobalFilter = null;

			if (sQuery) {
				this._oGlobalFilter = new Filter([
					new Filter("name", FilterOperator.Contains, sQuery),
					new Filter("phoneNumber", FilterOperator.Contains, sQuery),
				], false);
			}

			this._filter();
			//this.resetItems();
		},
		
		//clear all filters
		clearAllFilters: function (oEvent) {
			var z = oEvent.getSource().sId;
			this.curTable = sap.ui.getCore().byId(z).getParent().getParent().sId;
			var oTable = sap.ui.getCore().byId(this.curTable); //this.byId(this.curTable);

			var oUiModel = this.getView().getModel("ui");
			oUiModel.setProperty("/globalFilter", "");
			oUiModel.setProperty("/availabilityFilterOn", false);

			this._oGlobalFilter = null;
			this._oPriceFilter = null;
			this._filter();

			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}
			this.getView().byId("search").setValue("");
			//this.resetItems();
		},
		
		//actual filtering of content in the table
		_filter: function () {
			var oFilter = null;
			var oTable = this.curTable;
			if (this._oGlobalFilter && this._oPriceFilter) {
				oFilter = new sap.ui.model.Filter([this._oGlobalFilter, this._oPriceFilter], true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			} else if (this._oPriceFilter) {
				oFilter = this._oPriceFilter;
			}

			sap.ui.getCore().byId(oTable).getBinding("rows").filter(oFilter, "Application");
			//this.resetItems();
		},
	});
});