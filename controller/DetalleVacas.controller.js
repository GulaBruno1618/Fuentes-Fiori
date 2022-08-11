sap.ui.define(["jquery.sap.global","sap/ui/core/mvc/Controller","sap/ui/core/routing/History","sap/ui/model/json/JSONModel","sap/m/MessageToast"],function(e,t,a,s,r){"use strict";return t.extend("zsap.vacaciones.solicvacaciones.controller.DetalleVacas",{onInit:function(){var e=this.getOwnerComponent().getRouter();e.getRoute("CrearVacaciones").attachMatched(this._onRouteMatched,this);var t=0},_onRouteMatched:function(e){var t=this.getOwnerComponent().getRouter();var t=this.getOwnerComponent().getRouter();var a=this.getOwnerComponent().getRouter("object").oHashChanger.hash;var s=a.search("CrearVacaciones");s=s+16;var r=0;r=a.substr(s,2);s=s+3;var o=0;o=a.substr(s,2);this.getView().byId("ipendientes").setValue(r);this.getView().byId("isolicitadas").setValue(o);var i=r-o;this.getView().byId("IDias").setValue(i)},onNavBack1:function(){var e=a.getInstance();var t=e.getPreviousHash();if(t!==undefined){window.history.go(-1)}else{var s=this.getOwnerComponent().getRouter();s.navTo("RouteVacaciones_Main",{},true)}},handleCalendarSelect:function(e){var t=e.getSource();this._updateText(t.getSelectedDates()[0])},_updateText:function(e){var t=this.byId("selectedDateFrom"),a=this.byId("selectedDateFrom2"),s=this.byId("selectedDateTo"),r=this.byId("selectedDateTo2"),o;if(e){var i;var n;o=e.getStartDate();i=sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd/MM/yyyy"});n=i.format(o);if(o){a.setText(o);t.setText(n)}else{s.setText("Seleccionar")}o=e.getEndDate();i=sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd/MM/yyyy"});n=i.format(o);if(o){s.setText(n);r.setText(o)}else{s.setText("Seleccionar")}}else{t.setText("Seleccionar");s.setText("Seleccionar")}var c=e.getStartDate();var l=e.getEndDate();i=sap.ui.core.format.DateFormat.getDateInstance({pattern:"MM/dd/yyyy"});var d=i.format(c);var u=i.format(l);var h=new Date(d);var v=new Date(u);var g=Math.abs(h.getTime()-v.getTime());var p=Math.ceil(g/(1e3*60*60*24))+1;var D=this.getView().byId("ipendientes").getValue();var m=this.getView().byId("isolicitadas").getValue();var f=D-m;if(f<p){alert("Total solicitado mayor al disponible")}else{this.byId("ICantidad").setText(p)}},handleSelectThisWeek:function(){this._selectWeekInterval(6)},handleSelectWorkWeek:function(){this._selectWeekInterval(4)},handleWeekNumberSelect:function(e){var t=e.getParameter("weekDays"),a=e.getParameter("weekNumber");if(a%5===0){e.preventDefault();r.show("You are not allowed to select this calendar week!")}else{this._updateText(t)}},_selectWeekInterval:function(e){var t=new Date,a=t.getDate()-t.getDay()+1,s=a+e,r=new Date(t.setDate(a)),o=new Date(t.setDate(s)),i=this.byId("calendar");i.removeAllSelectedDates();i.addSelectedDate(new DateRange({startDate:r,endDate:o}));this._updateText(i.getSelectedDates()[0])},onButtonCarga:function(){var t=this.getOwnerComponent().getModel("Inicial");var a=[];var s=this.byId("selectedDateFrom").getText();var o=this.byId("selectedDateTo").getText();var i=this.byId("ICantidad").getText();if(i>0){if(s!=""&&o!=""){var n=new sap.ui.model.Filter("Fdesde",sap.ui.model.FilterOperator.EQ,s);a.push(n);n=new sap.ui.model.Filter("Fhasta",sap.ui.model.FilterOperator.EQ,o);a.push(n);t.read("/TablaStatusSet",{filters:a,success:e.proxy(this._readODataOnSuccess_creavacaciones,this),error:e.proxy(this._readODataOnError_creavacaciones,this)})}else{r.show("Se deben seleccionar las dos fechas")}}else{r.show("Cantidad de d�as solicitados es inv�lido")}},_readODataOnSuccess_creavacaciones:function(e){var t=new sap.ui.model.json.JSONModel;t.setData(e);r.show("Vacaciones Solicitadas Correctamente se envi� un email al supervisor para su aprobaci�n");this._oDialog.close();var a=this.getOwnerComponent().getRouter();a.navTo("RouteVacaciones_Main",{},true)},_readODataOnError_creavacaciones:function(e){var t=e.responseText;var a=t.search("value");a=a+8;var s=t.substr(a,360);if(s.length<1){var o="Error de conectividad"}r.show(s);this._oDialog.close()}})});