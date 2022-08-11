sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */

    
     function (Controller, MessageToast, JSONModel, MessageBox) {
		"use strict";

        var vUnaEsp; //declare variables with no initialization
        var vTipoCarga;
        var vCanVac;
        var vCanEsp;


		return Controller.extend("zsap.vacaciones.solicvacaciones.controller.Vacaciones_Main", {
            varInit: function(){ 
           
                //initialize variables with appropriate view elements
                vUnaEsp = 0;
            },

            onInit: function () {
                
                var Lvtotal = 0;
                this.CargarVacaciones();

            },


        onPressList: function () {
         this.CargarVacaciones();
        }, 
            
        CargarVacaciones: function () {

            if (!this._oDialog) {
				this._oDialog = new sap.m.BusyDialog().open();
			} else {
				this._oDialog.open();
            };
            
             var vVanos; 

             var oModel = this.getOwnerComponent().getModel('Inicial');
             var sFilter = [];

					var sFieldFilter = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, vVanos);
					sFilter.push(sFieldFilter);                    


                    oModel.read("/DetVacacionesSet", {
					filters: sFilter,
							success: jQuery.proxy(this._readODataOnSuccess_vacaciones, this),
							error: jQuery.proxy(this._readODataOnError_vacaciones, this)
                 });
           },

                _readODataOnSuccess_vacaciones: function (oData) {
					var jsonModel = new sap.ui.model.json.JSONModel();
					    jsonModel.setData(oData);

                     this.getView().byId('IUsuario').setValue(oData.results[0].Pernr);
                     this.getView().byId('INombre').setValue(oData.results[0].Sname);
                     this.getView().byId('IVacac').setValue(oData.results[0].CUENTA);
                     this.getView().byId('ISaldo').setValue(oData.results[0].SOLIC);                    

                     var vCuenta = oData.results[0].CUENTA - oData.results[0].SOLIC;

                     this.getView().byId('Icuenta').setText(vCuenta);
					 this.getView().byId('TblVacaciones').setModel(jsonModel);


                    vCanVac = 0;
                    vCanEsp = 0;

                    for (var i = 0; i < oData.results.length; i++){
                        if ( oData.results[i].TIPO == "Vac. Especiales" ){
                        vUnaEsp = 1;
                        vCanEsp = vCanEsp + oData.results[i].SALDO;                         
                    }else{
                        vCanVac = vCanVac + oData.results[i].SALDO;
                         }
                    }

                    this._oDialog.close();

                    this.CargarAprobadas();

                },

				_readODataOnError_vacaciones: function (oError) {
					
	 			    var responseXml = oError.responseText;
		            var donde = responseXml.search("value")
  	 	                donde = donde + 8;
		            var messages = responseXml.substr(donde,60);
		            
		            if (messages.length < 1){
		                    var message = "Error de conectividad";
		            }
		            
					this.sap.m.MessageToast.show(messages);
					this._oDialog.close();
                },
                

    CargarAprobadas: function () {

                        var oModel = this.getOwnerComponent().getModel('Inicial');
                        var sFilter = [];
        
                        var vPernr = this.getView().byId("IUsuario").getValue();
                        
                        var sFieldFilter = new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.EQ, vPernr);
                        sFilter.push(sFieldFilter);                    
        
        
                            oModel.read("/VacacionesAprobSet", {
                            filters: sFilter,
                                    success: jQuery.proxy(this._readODataOnSuccess_vacacionesap, this),
                                    error: jQuery.proxy(this._readODataOnError_vacacionesap, this)
                            });
                    },
        
            _readODataOnSuccess_vacacionesap: function (oData) {
                var jsonModel = new sap.ui.model.json.JSONModel();
                    jsonModel.setData(oData);

                this.getView().byId('TblVacacionesAprob').setModel(jsonModel);
                this._oDialog.close();

            },

            _readODataOnError_vacacionesap: function (oError) {
                
                var responseXml = oError.responseText;
                var donde = responseXml.search("value")
                        donde = donde + 8;
                var messages = responseXml.substr(donde,260);
                
                if (messages.length < 1){
                        var message = "Error de conectividad";
                }
                
                this.sap.m.MessageToast.show(messages);
                this._oDialog.close();
            },
            
        
                                                 
/*               onButtonSolicitar: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                var lvVacacio = this.getView().byId('IVacac').getValue();
                var lvSolicit =  this.getView().byId('ISaldo').getValue();                    

			     	 oRouter.navTo("CrearVacaciones", {Pendientes : lvVacacio, Solicitada : lvSolicit }, true);


               },
*/
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

            let fecha = new Date();

            if (fecha > sDate){

                MessageBox.error("Fecha Inicial menor a Fecha Actual");
                //this.getView().byId("selectedDateFrom2").setText("");
                oSelectedDateFrom2.setText('');
                oSelectedDateFrom.setText('Seleccionar');
                oSelectedDates.destroy();
            }

            var LvPendientes = this.getView().byId("Icuenta").getText();
            var Lvtotal = LvPendientes ;

                
            if (Lvtotal < diffD) {
              MessageBox.error("Total solicitado mayor al disponible");
            } else {
              var vResto =  Lvtotal - diffD;    
            this.byId("ICantidad").setText(diffD);
            this.byId("IResto").setText(vResto);

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
					MessageToast.show("Semana no permitida");
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

    _onchoseMessageBoxPress: function () {

        if (vUnaEsp == 1 ) {
            
        var that = this;    
        MessageBox.warning("Tipo de Vacaciones a Cargar", {
//            icon: sap-icon://create-leave-request,
            actions: ["Vacaciones", "Especiales"],
            emphasizedAction: "Vacaciones",
            onClose: function (sAction, that) {
//                MessageToast.show("Action selected: " + sAction);
                if ( sAction == "Vacaciones") {
                    vTipoCarga ='Vacaciones';
                    this.onButtonCarga();
                 } else if ( sAction == "Especiales") {
                    vTipoCarga = 'Especiales';
                    this.onButtonCarga(); 
                  }  
                }.bind(this)
        });
        
       }else{
            vTipoCarga ='Vacaciones';
            this.onButtonCarga();
       }
    },

    onButtonCarga: function(){

        if (!this._oDialog) {
            this._oDialog = new sap.m.BusyDialog().open();
        } else {
            this._oDialog.open();
        };

        var cantidad = this.byId("ICantidad").getText();
        var vpasa = true;

        if (vTipoCarga == 'Vacaciones') {
          if ( cantidad > vCanVac ) {
            this._oDialog.close();
            MessageToast.show('Cantidad de días Supera los disponibles de Vacaciones');
            vpasa = false;
            }     
         }else{
            if (vTipoCarga == 'Especiales') {
                if ( cantidad > vCanEsp ) {
                    this._oDialog.close();
                    MessageToast.show('Cantidad de días Supera los disponibles Especiales');
                    vpasa = false;
                }
            }
         }
        

                var oModel = this.getOwnerComponent().getModel('Inicial');
                var sFilter = [];
                var fechadesde = this.byId("selectedDateFrom").getText();
                var fechahasta = this.byId("selectedDateTo").getText();
                var pTipo = vTipoCarga;

                
            if (vpasa == true) {
              if (cantidad > 0 ){
                if (fechadesde!='' && fechahasta!=''){
                 var sFieldFilter = new sap.ui.model.Filter("Fdesde", sap.ui.model.FilterOperator.EQ, fechadesde);
                     sFilter.push(sFieldFilter);                    
                     sFieldFilter = new sap.ui.model.Filter("Fhasta", sap.ui.model.FilterOperator.EQ, fechahasta);
                     sFilter.push(sFieldFilter);                    
              
             
             if ( pTipo == 'Vacaciones') {
                sFieldFilter = new sap.ui.model.Filter("TipoVaca", sap.ui.model.FilterOperator.EQ, 'Vacaciones');
                sFilter.push(sFieldFilter);                    

             } else if ( pTipo == 'Especiales') {
                sFieldFilter = new sap.ui.model.Filter("TipoVaca", sap.ui.model.FilterOperator.EQ, 'Especiales');
                sFilter.push(sFieldFilter);                    
              }


                       oModel.read("/TablaStatusSet", {
                       filters: sFilter,
                               success: jQuery.proxy(this._readODataOnSuccess_creavacaciones, this),
                               error: jQuery.proxy(this._readODataOnError_creavacaciones, this)
                    });
                  }else{
                    this._oDialog.close();
                      MessageToast.show('Se deben seleccionar las dos fechas');
                  }
              }else{
               this._oDialog.close();
               MessageToast.show('Cantidad de días solicitados es inválido');  
              }
             }         
            },
   
       _readODataOnSuccess_creavacaciones: function (oData) {
                var jsonModel = new sap.ui.model.json.JSONModel();
                    jsonModel.setData(oData);

                this._oDialog.close();

                MessageToast.show('Vacaciones Solicitadas Correctamente se envió un email al supervisor para su aprobación');
                
                this.CargarVacaciones();
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
