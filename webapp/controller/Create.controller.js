sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
  ],
  function (BaseController, JSONModel, formatter, History, MessageToast, UIComponent) {
    "use strict";
    return BaseController.extend("fiorifreestylecrud1.controller.Create", {
      formatter: formatter,

      onInit: function () {
        // INSTANCIA OBJETOS DE MENSAGEM
        // var oMessageManager = sap.ui.getCore().getMessageManager();
        // var oView = this.getView();
        // oView.setModel(oMessageManager.getMessageModel(), "messagez" );

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("create").attachPatternMatched(this._onCreateMatched, this);

        //MODEL p/ iniciar valors
        var oViewModel = new JSONModel({
          Codigo: 0,
          Descricao: "",
          Kwmeng: "0.000",
          Meins: "",
          Netpr: "0.00",
          Waerk: "",
          DataCadastro: "",
          HoraCadastro: "",
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
                Kwmeng: "0.000",
                Meins: "",
                Netpr: "0.00",
                Waerk: "",
                DataCadastro: "",
                HoraCadastro: "",
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
          //Codigo: this.byId("inpCodigo").getValue(),
          Descricao: this.byId("inpDescricao").getValue(),
          Kwmeng: this.byId("inpKwmeng").getValue(),
          Meins: this.byId("inpMeins").getValue(),
          Netpr: this.byId("inpNetpr").getValue(),
          Waerk: this.byId("inpWaerk").getValue(),
          DataCadastro: this.byId("inpDataCadastro").getValue(),
          HoraCadastro: this.byId("inpHoraCadastro").getValue(),
        };

        // var dados = {
        //   //Codigo: this.byId("inpCodigo").getValue(),
        //   Descricao: "teste4",
        //   Kwmeng: "1",
        //   Meins: "UN",
        //   Netpr: "1",
        //   Waerk: "BRL",
        //   DataCadastro: "2022" + "-" + "11" + "-" + "26" + "T" + "00:00:00",
        // };

        // if (dados.Descricao == "") {
        //   MessageToast.show("Campo obrigatório");
        //   dados.Descricao.focus();
        //   return;
        // }

        // if (dados.Kwmeng == "") {
        //   MessageToast.show("Campo obrigatório");
        //   dados.Kwmeng.focus();
        //   return;
        // }

        // if (dados.Meins == "") {
        //   MessageToast.show("Campo obrigatório");
        //   dados.Meins.focus();
        //   return;
        // }

        // if (dados.Netpr == "") {
        //   MessageToast.show("Campo obrigatório");
        //   dados.Netpr.focus();
        //   return;
        // }

        // if (dados.Waerk == "") {
        //   MessageToast.show("Campo obrigatório");
        //   dados.Waerk.focus();
        //   return;
        // }

        // if (dados.DataCadastro == "") {
        //   MessageToast.show("Campo obrigatório");
        //   dados.DataCadastro.focus();
        //   return;
        // }

        var lv_kwmeng = dados.Kwmeng.replace(".", "");
        lv_kwmeng = lv_kwmeng.replace(",", ".");
        dados.Kwmeng = lv_kwmeng;

        var lv_Netpr = dados.Netpr.replace(".", "");
        lv_Netpr = lv_Netpr.replace(",", ".");
        dados.Netpr = lv_Netpr;

        //Formatar Data para o backend
        var lv_ano = dados.DataCadastro.substring(6, 10);
        var lv_mes = dados.DataCadastro.substring(3, 5);
        var lv_dia = dados.DataCadastro.substring(0, 2);
        //Formato de data: "2022" + "-" + "11" + "-" + "26" + "T00:00:00",
        var lv_DataCadastro = lv_ano + "-" + lv_mes + "-" + lv_dia + "T00:00:00";
        dados.DataCadastro = lv_DataCadastro;

        //Formatar Hora para o backend
        var lv_hora = dados.HoraCadastro;
        dados.HoraCadastro = "PT" + lv_hora.substring(0, 2) + "H" + lv_hora.substring(3, 5) + "M" + "00S";

        debugger;
        oModel.create("/Z270FREECRUD1Set", dados, {
          success: function (oDados, response) {
            var lv_message = JSON.parse(response.headers["sap-message"]);
            sap.m.MessageToast.show("Produto " + oDados.Codigo + " criado com sucesso !");
            this.onNavBack();
          }.bind(this),
          error: function (Error) {
            var lv_mensagem = JSON.parse(Error.responseText).error.message.value;
            debugger;
            MessageToast.show(lv_mensagem + dados.Descricao);
            this.onNavBack();
          }.bind(this),
        });
      },

      dataSel: function (oEvent) {
        var oText = this.byId("inpDataCadastro"),
          oDP = oEvent.getSource(),
          sValue = oEvent.getParameter("value"),
          bValid = oEvent.getParameter("valid");

        this._iEvent++;
        oText.setValue(sValue);

        if (bValid) {
          oDP.setValueState(ValueState.None);
        } else {
          oDP.setValueState(ValueState.Error);
        }
      },

      onCancelar: function (oEvent) {
        this.onNavBack();
      },
    });
  }
);
