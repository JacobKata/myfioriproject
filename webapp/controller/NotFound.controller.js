sap.ui.define([
		"coct/zdownload/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("coct.zdownload.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);