/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"coct/zdownload/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"coct/zdownload/test/integration/pages/Worklist",
	"coct/zdownload/test/integration/pages/Object",
	"coct/zdownload/test/integration/pages/NotFound",
	"coct/zdownload/test/integration/pages/Browser",
	"coct/zdownload/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "coct.zdownload.view."
	});

	sap.ui.require([
		"coct/zdownload/test/integration/WorklistJourney",
		"coct/zdownload/test/integration/ObjectJourney",
		"coct/zdownload/test/integration/NavigationJourney",
		"coct/zdownload/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});