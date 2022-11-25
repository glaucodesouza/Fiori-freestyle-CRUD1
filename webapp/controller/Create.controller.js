sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
  ],
  function (
    BaseController,
    JSONModel,
    formatter,
    History,
    MessageToast,
    UIComponent
  ) {
    "use strict";
    return BaseController.extend("fiorifreestylecrud1.controller.Create", {
      formatter: formatter,

      onInit: function () {
        // INSTANCIA OBJETOS DE MENSAGEM
        // var oMessageManager = sap.ui.getCore().getMessageManager();
        // var oView = this.getView();
        // oView.setModel(oMessageManager.getMessageModel(), "messagez" );

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter
          .getRoute("create")
          .attachPatternMatched(this._onCreateMatched, this);

        //MODEL p/ iniciar valors
        var oViewModel = new JSONModel({
          Codigo: 0,
          Descricao: "",
          Kwmeng: "0.000",
          Meins: "KG",
          Netpr: "0.00",
          Waerk: "BRL",
        });
        this.getView().setModel(oViewModel, "view");
      },

      _onCreateMatched: function (oEvent) {
        var m = this.getView().getModel();
        m.metadataLoaded().then(
          function () {
            var oContext = m.createEntry("/Z270FREECRUD1Set", {
              properties: {
                Descricao: "",
                Kwmeng: "0.00",
                Meins: "",
                Netpr: "0.00",
                Waerk: "",
              },
            });
            this.getView().bindElement({
              path: oContext.getPath(),
              expand: "view",
              //model: "view",
            });
          }.bind(this)
        );
      },

      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = UIComponent.getRouterFor(this);
          oRouter.navTo("worklist", {}, true);
        }
      },

      parseFloatExternoBrasileiro(string) {},

      onGravar: function () {
        //Limpar mensagens antigas
        sap.ui.getCore().getMessageManager().removeAllMessages();

        var oModel = this.getView().getModel();

        var dados = {
          // Codigo:     this.byId("inpCodigo").getValue(),
          Descricao: this.byId("inpDescricao").getValue(),
          Kwmeng: this.byId("inpKwmeng").getValue(),
          Meins: this.byId("inpMeins").getValue(),
          Netpr: this.byId("inpNetpr").getValue(),
          Waerk: this.byId("inpWaerk").getValue(),
        };

        if (dados.Descricao == "") {
          MessageToast.show("Campo obrigatório");
          dados.Descricao.focus();
          return;
        }

        if (dados.Kwmeng == "") {
          MessageToast.show("Campo obrigatório");
          dados.Kwmeng.focus();
          return;
        }

        if (dados.Meins == "") {
          MessageToast.show("Campo obrigatório");
          dados.Meins.focus();
          return;
        }

        if (dados.Netpr == "") {
          MessageToast.show("Campo obrigatório");
          dados.Netpr.focus();
          return;
        }

        if (dados.Waerk == "") {
          MessageToast.show("Campo obrigatório");
          dados.Waerk.focus();
          return;
        }

        //debugger;
        var lv_kwmeng = dados.Kwmeng.replace(".", "");
        lv_kwmeng = lv_kwmeng.replace(",", ".");
        dados.Kwmeng = lv_kwmeng;

        var lv_Netpr = dados.Netpr.replace(".", "");
        lv_Netpr = lv_Netpr.replace(",", ".");
        dados.Netpr = lv_Netpr;

        //FORMA 1 de Criaçãocom  método oData
        oModel.create("/Z270FREECRUD1Set", dados, {
          success: function (oDados, response) {
            //var lv_message = JSON.parse(response.headers["sap-message"]);
            //this.getView().setBusy(false);
            var lv_message = JSON.parse(response.headers["sap-message"]);
            sap.m.MessageToast.show(
              "Produto " + oDados.Codigo + " criado com sucesso !"
            );
            this.onNavBack();
          }.bind(this),
          error: function (Error) {
            var lv_mensagem = JSON.parse(Error.responseText).error.message
              .value;
            MessageToast.show(lv_mensagem + dados.Descricao);
            this.onNavBack();
          }.bind(this),
        });
      },

      onCancelar: function (oEvent) {
        this.onNavBack();
      },
    });
  }
);
