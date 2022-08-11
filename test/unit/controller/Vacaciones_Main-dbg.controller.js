/*global QUnit*/

sap.ui.define([
	"zsapvacaciones./solic_vacaciones/controller/Vacaciones_Main.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Vacaciones_Main Controller");

	QUnit.test("I should test the Vacaciones_Main controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
