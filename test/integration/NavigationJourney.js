sap.ui.define(["sap/ui/test/opaQunit","./pages/Vacaciones_Main"],function(e){"use strict";QUnit.module("Navigation Journey");e("Should see the initial page of the app",function(e,i,a){e.iStartMyApp();a.onTheAppPage.iShouldSeeTheApp();a.iTeardownMyApp()})});