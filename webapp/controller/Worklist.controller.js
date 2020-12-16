/*global location history */
// jQuery.sap.require("sap.ui.core.util.Export");
// jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
sap.ui.define([
	"coct/zdownload/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"coct/zdownload/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/syncStyleClass",
	"sap/ui/core/Fragment",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet",
	"coct/zdownload/model/oDataHelper",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, syncStyleClass,
	Fragment, library, Spreadsheet, oDataHelper, Export, ExportTypeCSV, MessageToast,Sorter) {
	"use strict";
	var EdmType = library.EdmType;
	return BaseController.extend("coct.zdownload.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			debugger;
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			var sServiceUrl = "/sap/opu/odata/sap/ZDOWNLOAD_SRV/";
			// set data model
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {
				json: true,
				defaultBindingMode: "OneWay",
				useBatch: true,
				defaultCountMode: "Inline",
				loadMetadataAsync: true
			});
			sap.ui.getCore().setModel(oModel);
			//---> Create the Instance of the oData Object
			if (!this.oDataModel) {
				this.oDataModel = this.getOwnerComponent().getModel();
			}

			this.PersData();

		},

		createColumnConfig: function() {
			return [{
				label: 'User ID',
				property: 'Name1',
				type: EdmType.String,
				width: '25'
			}, {
				label: 'Firstname',
				property: 'Name2',
				type: EdmType.String,
				width: '25'
			}, {
				label: 'City1',
				property: 'City1',
				type: EdmType.String,
				width: '25'
			}, {
				label: 'PostCode1',
				property: 'PostCode1',
				type: EdmType.String,
				width: '18'
			}];
		},

		onExport: function() {
			debugger;
			var aCols, aProducts, modelData, oSettings, oSheet;
			var oTable = this.getView().byId("idImpactTable");
			aCols = this.createColumnConfig();
			modelData = oTable.getModel("impactModel").getProperty("/results");

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: modelData
			};

			// new Spreadsheet(oSettings).build();
			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then(function() {
					MessageToast.show("Spreadsheet export has finished");
				})
				.finally(oSheet.destroy);
		},

		createViewSettingsDialog: function(sDialogFragmentName) {
			this._mViewSettingsDialogs = {};
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

			}
			return oDialog;
		},

		handleSortButtonPressed: function() {
			this.createViewSettingsDialog("coct.zdownload.fragments.SortDialog").open();
		},
		handleSortDialogConfirm: function(oEvent) {
			debugger;
			var oTable = this.getView().byId("idImpactTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);

		},
		PersData: function() {
			debugger;
			var sPath = "/PerInfoSet?$format=json";
			// load BusyDialog fragment asynchronously

			var oTable = this.getView().byId("idImpactTable");

			//---> using promise technique to avoid callback 
			oDataHelper.callGETOData(this.oDataModel, sPath)
				.then(function(data, oResponse) {
					var oModel = new sap.ui.model.json.JSONModel(data);
					oTable.setModel(oModel, "impactModel");

				})
				.catch(function(oError, oResponse) {

					// this is to display the error message to user

				});

		},

		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function() {
			history.go(-1);
		},

		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Name1")
			});
		}

	});
});