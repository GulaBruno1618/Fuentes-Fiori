sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/m/MessageBox"],function(e,a,t,s){"use strict";var i;var r;var o;var n;return e.extend("zsap.vacaciones.solicvacaciones.controller.Vacaciones_Main",{varInit:function(){i=0},onInit:function(){var e=0;this.CargarVacaciones()},onPressList:function(){this.CargarVacaciones()},CargarVacaciones:function(){if(!this._oDialog){this._oDialog=(new sap.m.BusyDialog).open()}else{this._oDialog.open()}var e;var a=this.getOwnerComponent().getModel("Inicial");var t=[];var s=new sap.ui.model.Filter("Pernr",sap.ui.model.FilterOperator.EQ,e);t.push(s);a.read("/DetVacacionesSet",{filters:t,success:jQuery.proxy(this._readODataOnSuccess_vacaciones,this),error:jQuery.proxy(this._readODataOnError_vacaciones,this)})},_readODataOnSuccess_vacaciones:function(e){var a=new sap.ui.model.json.JSONModel;a.setData(e);this.getView().byId("IUsuario").setValue(e.results[0].Pernr);this.getView().byId("INombre").setValue(e.results[0].Sname);this.getView().byId("IVacac").setValue(e.results[0].CUENTA);this.getView().byId("ISaldo").setValue(e.results[0].SOLIC);var t=e.results[0].CUENTA-e.results[0].SOLIC;this.getView().byId("Icuenta").setText(t);this.getView().byId("TblVacaciones").setModel(a);o=0;n=0;for(var s=0;s<e.results.length;s++){if(e.results[s].TIPO=="Vac. Especiales"){i=1;n=n+e.results[s].SALDO}else{o=o+e.results[s].SALDO}}this._oDialog.close();this.CargarAprobadas()},_readODataOnError_vacaciones:function(e){var a=e.responseText;var t=a.search("value");t=t+8;var s=a.substr(t,60);if(s.length<1){var i="Error de conectividad"}this.sap.m.MessageToast.show(s);this._oDialog.close()},CargarAprobadas:function(){var e=this.getOwnerComponent().getModel("Inicial");var a=[];var t=this.getView().byId("IUsuario").getValue();var s=new sap.ui.model.Filter("Pernr",sap.ui.model.FilterOperator.EQ,t);a.push(s);e.read("/VacacionesAprobSet",{filters:a,success:jQuery.proxy(this._readODataOnSuccess_vacacionesap,this),error:jQuery.proxy(this._readODataOnError_vacacionesap,this)})},_readODataOnSuccess_vacacionesap:function(e){var a=new sap.ui.model.json.JSONModel;a.setData(e);this.getView().byId("TblVacacionesAprob").setModel(a);this._oDialog.close()},_readODataOnError_vacacionesap:function(e){var a=e.responseText;var t=a.search("value");t=t+8;var s=a.substr(t,260);if(s.length<1){var i="Error de conectividad"}this.sap.m.MessageToast.show(s);this._oDialog.close()},handleCalendarSelect:function(e){var a=e.getSource();this._updateText(a.getSelectedDates()[0])},_updateText:function(e){var a=this.byId("selectedDateFrom"),t=this.byId("selectedDateFrom2"),i=this.byId("selectedDateTo"),r=this.byId("selectedDateTo2"),o;if(e){var n;var c;o=e.getStartDate();n=sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd/MM/yyyy"});c=n.format(o);if(o){t.setText(o);a.setText(c)}else{i.setText("Seleccionar")}o=e.getEndDate();n=sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd/MM/yyyy"});c=n.format(o);if(o){i.setText(c);r.setText(o)}else{i.setText("Seleccionar")}}else{a.setText("Seleccionar");i.setText("Seleccionar")}var l=e.getStartDate();var d=e.getEndDate();n=sap.ui.core.format.DateFormat.getDateInstance({pattern:"MM/dd/yyyy"});var u=n.format(l);var h=n.format(d);var p=new Date(u);var v=new Date(h);var g=Math.abs(p.getTime()-v.getTime());var D=Math.ceil(g/(1e3*60*60*24))+1;let f=new Date;if(f>p){s.error("Fecha Inicial menor a Fecha Actual");t.setText("");a.setText("Seleccionar");e.destroy()}var m=this.getView().byId("Icuenta").getText();var y=m;if(y<D){s.error("Total solicitado mayor al disponible")}else{var _=y-D;this.byId("ICantidad").setText(D);this.byId("IResto").setText(_)}},handleSelectThisWeek:function(){this._selectWeekInterval(6)},handleSelectWorkWeek:function(){this._selectWeekInterval(4)},handleWeekNumberSelect:function(e){var t=e.getParameter("weekDays"),s=e.getParameter("weekNumber");if(s%5===0){e.preventDefault();a.show("Semana no permitida")}else{this._updateText(t)}},_selectWeekInterval:function(e){var a=new Date,t=a.getDate()-a.getDay()+1,s=t+e,i=new Date(a.setDate(t)),r=new Date(a.setDate(s)),o=this.byId("calendar");o.removeAllSelectedDates();o.addSelectedDate(new DateRange({startDate:i,endDate:r}));this._updateText(o.getSelectedDates()[0])},_onchoseMessageBoxPress:function(){if(i==1){var e=this;s.warning("Tipo de Vacaciones a Cargar",{actions:["Vacaciones","Especiales"],emphasizedAction:"Vacaciones",onClose:function(e,a){if(e=="Vacaciones"){r="Vacaciones";this.onButtonCarga()}else if(e=="Especiales"){r="Especiales";this.onButtonCarga()}}.bind(this)})}else{r="Vacaciones";this.onButtonCarga()}},onButtonCarga:function(){if(!this._oDialog){this._oDialog=(new sap.m.BusyDialog).open()}else{this._oDialog.open()}var e=this.byId("ICantidad").getText();var t=true;if(r=="Vacaciones"){if(e>o){this._oDialog.close();a.show("Cantidad de d�as Supera los disponibles de Vacaciones");t=false}}else{if(r=="Especiales"){if(e>n){this._oDialog.close();a.show("Cantidad de d�as Supera los disponibles Especiales");t=false}}}var s=this.getOwnerComponent().getModel("Inicial");var i=[];var c=this.byId("selectedDateFrom").getText();var l=this.byId("selectedDateTo").getText();var d=r;if(t==true){if(e>0){if(c!=""&&l!=""){var u=new sap.ui.model.Filter("Fdesde",sap.ui.model.FilterOperator.EQ,c);i.push(u);u=new sap.ui.model.Filter("Fhasta",sap.ui.model.FilterOperator.EQ,l);i.push(u);if(d=="Vacaciones"){u=new sap.ui.model.Filter("TipoVaca",sap.ui.model.FilterOperator.EQ,"Vacaciones");i.push(u)}else if(d=="Especiales"){u=new sap.ui.model.Filter("TipoVaca",sap.ui.model.FilterOperator.EQ,"Especiales");i.push(u)}s.read("/TablaStatusSet",{filters:i,success:jQuery.proxy(this._readODataOnSuccess_creavacaciones,this),error:jQuery.proxy(this._readODataOnError_creavacaciones,this)})}else{this._oDialog.close();a.show("Se deben seleccionar las dos fechas")}}else{this._oDialog.close();a.show("Cantidad de d�as solicitados es inv�lido")}}},_readODataOnSuccess_creavacaciones:function(e){var t=new sap.ui.model.json.JSONModel;t.setData(e);this._oDialog.close();a.show("Vacaciones Solicitadas Correctamente se envi� un email al supervisor para su aprobaci�n");this.CargarVacaciones()},_readODataOnError_creavacaciones:function(e){var t=e.responseText;var s=t.search("value");s=s+8;var i=t.substr(s,360);if(i.length<1){var r="Error de conectividad"}a.show(i);this._oDialog.close()}})});