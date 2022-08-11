sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",    
	"sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (jQuery, Controller, History, JSONModel, MessageToast) {
		"use strict";

    return Controller.extend("zsap.vacaciones.solicvacaciones.controller.DetalleVacas", {
			onInit: function () {

             var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("CrearVacaciones").attachMatched(this._onRouteMatched, this);

              var Lvtotal = 0;   
            },

    _onRouteMatched: function (oEvent){
             var oRouter = this.getOwnerComponent().getRouter();

                var oRouter = this.getOwnerComponent().getRouter();
                var detalle = this.getOwnerComponent().getRouter("object").oHashChanger.hash;
                var donde = detalle.search("CrearVacaciones")
                donde = donde + 16;

                var LvPendientes = 0;
                LvPendientes = detalle.substr(donde, 2);
                
                donde = donde + 3;

                var LvSolicitada = 0; 
                    LvSolicitada = detalle.substr(donde, 2);

                this.getView().byId("ipendientes").setValue(LvPendientes);
                this.getView().byId("isolicitadas").setValue(LvSolicitada);

                var Lvtotal = LvPendientes - LvSolicitada;

                this.getView().byId("IDias").setValue(Lvtotal);
                

            }, 


	onNavBack1: function () {

            var oHistory = History.getInstance(); 
            var sPreviousHash = oHistory.getPreviousHash(); 

            if (sPreviousHash !== undefined) 
            { window.history.go(-1); } 
            else {
                
                var oRouter = this.getOwnerComponent().getRouter(); 
                oRouter.navTo("RouteVacaciones_Main", {}, true); }

    },
    
   	handleCalendarSelect: function (oEvent) {
				var oCalendar = oEvent.getSource();
				this._updateText(oCalendar.getSelectedDates()[0]);
			},

	_updateText: function (oSelectedDates) {
				var oSelectedDateFrom = this.byId("selectedDateFrom"),
					oSelectedDateFrom2 = this.byId("selectedDateFrom2"),
					oSelectedDateTo = this.byId("selectedDateTo"),
					oSelectedDateTo2 = this.byId("selectedDateTo2"),
					oDate;

				if (oSelectedDates) {
					var dateFormat;
					var dateFormatted;

					oDate = oSelectedDates.getStartDate();
					dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd/MM/yyyy"
					});
					dateFormatted = dateFormat.format(oDate);
					if (oDate) {
						//oSelectedDateFrom.setText(this.oFormatYyyymmdd.format(oDate));
						oSelectedDateFrom2.setText(oDate);
						oSelectedDateFrom.setText(dateFormatted);
					} else {
						oSelectedDateTo.setText("Seleccionar");
					}
					oDate = oSelectedDates.getEndDate();
					dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "dd/MM/yyyy"
					});
					dateFormatted = dateFormat.format(oDate);
					if (oDate) {
						//oSelectedDateTo.setText(this.oFormatYyyymmdd.format(oDate));
						oSelectedDateTo.setText(dateFormatted);
						oSelectedDateTo2.setText(oDate);
					} else {
						oSelectedDateTo.setText("Seleccionar");
					}
				} else {
					oSelectedDateFrom.setText("Seleccionar");
					oSelectedDateTo.setText("Seleccionar");
                }

                 var startDate = oSelectedDates.getStartDate();
                 var endDate = oSelectedDates.getEndDate();

					dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "MM/dd/yyyy"
					});
				var	EstartDate = dateFormat.format(startDate);
                var EendDate = dateFormat.format(endDate);

                var sDate = new Date(EstartDate);
                var eDate = new Date(EendDate);

                var diff = Math.abs(sDate.getTime() - eDate.getTime());
                var diffD = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; 

                var LvPendientes = this.getView().byId("ipendientes").getValue();
                var LvSolicitada = this.getView().byId("isolicitadas").getValue();

                var Lvtotal = LvPendientes - LvSolicitada;

                //alert(diffD);
                
               if (Lvtotal < diffD) {
                //MessageToast.show('Total solicitado mayor al disponible');
                alert('Total solicitado mayor al disponible');
               } else {
                this.byId("ICantidad").setText(diffD);
               }
            },

	handleSelectThisWeek: function () {
				this._selectWeekInterval(6);
			},

	handleSelectWorkWeek: function () {
				this._selectWeekInterval(4);
			},

	handleWeekNumberSelect: function (oEvent) {
				var oDateRange = oEvent.getParameter("weekDays"),
					iWeekNumber = oEvent.getParameter("weekNumber");

				if (iWeekNumber % 5 === 0) {
					oEvent.preventDefault();
					MessageToast.show("You are not allowed to select this calendar week!");
				} else {
					this._updateText(oDateRange);
				}

			},

	_selectWeekInterval: function (iDays) {
				var oCurrent = new Date(), // get current date
					iWeekStart = oCurrent.getDate() - oCurrent.getDay() + 1,
					iWeekEnd = iWeekStart + iDays, // end day is the first day + 6
					oMonday = new Date(oCurrent.setDate(iWeekStart)),
					oSunday = new Date(oCurrent.setDate(iWeekEnd)),
					oCalendar = this.byId("calendar");

				oCalendar.removeAllSelectedDates();
				oCalendar.addSelectedDate(new DateRange({
					startDate: oMonday,
					endDate: oSunday
				}));

				this._updateText(oCalendar.getSelectedDates()[0]);

            },

    onButtonCarga: function(){

             var oModel = this.getOwnerComponent().getModel('Inicial');
             var sFilter = [];
             var fechadesde = this.byId("selectedDateFrom").getText();
             var fechahasta = this.byId("selectedDateTo").getText();
             var cantidad = this.byId("ICantidad").getText();

           if (cantidad > 0 ){
             if (fechadesde!='' && fechahasta!=''){
              var sFieldFilter = new sap.ui.model.Filter("Fdesde", sap.ui.model.FilterOperator.EQ, fechadesde);
                  sFilter.push(sFieldFilter);                    
                  sFieldFilter = new sap.ui.model.Filter("Fhasta", sap.ui.model.FilterOperator.EQ, fechahasta);
                  sFilter.push(sFieldFilter);                    

                    oModel.read("/TablaStatusSet", {
					filters: sFilter,
							success: jQuery.proxy(this._readODataOnSuccess_creavacaciones, this),
							error: jQuery.proxy(this._readODataOnError_creavacaciones, this)
                 });
               }else{
                   MessageToast.show('Se deben seleccionar las dos fechas');
               }
           }else{
            MessageToast.show('Cantidad de días solicitados es inválido');  
           }         
           },

    _readODataOnSuccess_creavacaciones: function (oData) {
					var jsonModel = new sap.ui.model.json.JSONModel();
					    jsonModel.setData(oData);

                    MessageToast.show('Vacaciones Solicitadas Correctamente se envió un email al supervisor para su aprobación');
					
                    this._oDialog.close();

                    var oRouter = this.getOwnerComponent().getRouter(); 
                    oRouter.navTo("RouteVacaciones_Main", {}, true); 
    

        },

	_readODataOnError_creavacaciones: function (oError) {
					
	 			    var responseXml = oError.responseText;
		            var donde = responseXml.search("value")
  	 	                donde = donde + 8;
		            var messages = responseXml.substr(donde,360);
		            
		            if (messages.length < 1){
		                    var message = "Error de conectividad";
		            }
		            
					MessageToast.show(messages);
					this._oDialog.close();
        },                          
  });
});