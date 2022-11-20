sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("fiorifreestylecrud1.controller.Worklist", {
      formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        var oViewModel;

        // keeps the search state
        this._aTableSearchState = [];

        // Model used to manipulate control states
        oViewModel = new JSONModel({
          worklistTableTitle:
            this.getResourceBundle().getText("worklistTableTitle"),
          shareSendEmailSubject: this.getResourceBundle().getText(
            "shareSendEmailWorklistSubject"
          ),
          shareSendEmailMessage: this.getResourceBundle().getText(
            "shareSendEmailWorklistMessage",
            [location.href]
          ),
          tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
        });
        this.setModel(oViewModel, "worklistView");
      },

      /* =========================================================== */
      /* metodos customizados                                        */
      /* =========================================================== */
      onCriar: function (oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("create", {});
      },

      onDeletar: function (oEvent) {
        var oSource = oEvent.getSource();
        var oParent = oSource.getParent();
        var bc = oParent.getBindingContext();
        var path = bc.getPath();
        var obj = bc.getObject();
        var oModel = this.getView().getModel();

        oModel.remove(path, {
          success: function () {
            sap.m.MessageToast.show("Produto eliminado com sucesso !");
            oModel.refresh();
          }.bind(this),
          error: function (e) {
            //console.error(e);
          }.bind(this),
        });
      },
      onDeletarMuitos: function () {
        //--------------------------------------------------
        // Deleção em massa
        // Com uso de batch request
        // Deletar todos os registros marcados na tela
        //--------------------------------------------------

        //Limpar mensagens antigas
        sap.ui.getCore().getMessageManager().removeAllMessages();

        var oTable = this.byId("table");
        //Pegar linhas selecionadas
        var aSelectedItens = oTable.getSelectedContexts();

        var aItens = aSelectedItens.map(function (oItem) {
          return oItem.getPath();
        });

        for (var i = 0; i < aItens.length; i++) {
          //this.getView().getModel().remove(sPath,{
          this.getView()
            .getModel()
            .remove(aItens[i], {
              success: function (oData, response) {
                debugger;
                var lv_message = JSON.parse(response.headers["sap-message"]);
                //adicionar mensagens no messagemodel
                // var oMessage = new sap.ui.core.message.Message({
                //         message: mensagem.message,
                //         type: mensagem.severity,
                //         target: mensagem.target,
                //         processor: this.getView().getModel()
                //     });

                // sap.ui.getCore().getMessageManager().addMessages(oMessage);
                // sap.m.MessageToast.show(lv_message);
              }.bind(this),
              error: function (e) {
                debugger;
                console.log("Erro ao deletar");
              }.bind(this),
            });
        }
      },

      onAprovarProduto: function (oEvent) {
        var oSource = oEvent.getSource();
        var oParent = oSource.getParent();
        var bc = oParent.getBindingContext();
        var path = bc.getPath();
        var obj = bc.getObject();
        var oModel = this.getView().getModel();

        oModel.callFunction("/aprovar_produto", {
          method: "GET",
          urlParameters: {
            Codigo: obj.Codigo,
          },
          success: function () {
            sap.m.MessageToast.show("Produto aprovado com sucesso !");
          }.bind(this),
          error: function (e) {
            console.error(e);
          }.bind(this),
        });
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Triggered by the table's 'updateFinished' event: after new table
       * data is available, this handler method updates the table counter.
       * This should only happen if the update was successful, which is
       * why this handler is attached to 'updateFinished' and not to the
       * table's list binding's 'dataReceived' method.
       * @param {sap.ui.base.Event} oEvent the update finished event
       * @public
       */
      onUpdateFinished: function (oEvent) {
        // update the worklist's object counter after the table update
        var sTitle,
          oTable = oEvent.getSource(),
          iTotalItems = oEvent.getParameter("total");
        // only update the counter if the length is final and
        // the table is not empty
        if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
          sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [
            iTotalItems,
          ]);
        } else {
          sTitle = this.getResourceBundle().getText("worklistTableTitle");
        }
        this.getModel("worklistView").setProperty(
          "/worklistTableTitle",
          sTitle
        );
      },

      /**
       * Event handler when a table item gets pressed
       * @param {sap.ui.base.Event} oEvent the table selectionChange event
       * @public
       */
      onPress: function (oEvent) {
        // The source is the list item that got pressed
        this._showObject(oEvent.getSource());
      },

      /**
       * Event handler for navigating back.
       * Navigate back in the browser history
       * @public
       */
      onNavBack: function () {
        // eslint-disable-next-line sap-no-history-manipulation
        history.go(-1);
      },

      onSearch: function (oEvent) {
        if (oEvent.getParameters().refreshButtonPressed) {
          // Search field's 'refresh' button has been pressed.
          // This is visible if you select any main list item.
          // In this case no new search is triggered, we only
          // refresh the list binding.
          this.onRefresh();
        } else {
          var aTableSearchState = [];
          var sQuery = oEvent.getParameter("query");

          if (sQuery && sQuery.length > 0) {
            aTableSearchState = [
              new Filter("Codigo", FilterOperator.Contains, sQuery),
            ];
          }
          this._applySearch(aTableSearchState);
        }
      },

      /**
       * Event handler for refresh event. Keeps filter, sort
       * and group settings and refreshes the list binding.
       * @public
       */
      onRefresh: function () {
        var oTable = this.byId("table");
        oTable.getBinding("items").refresh();
      },

      /* =========================================================== */
      /* internal methods                                            */
      /* =========================================================== */

      /**
       * Shows the selected item on the object page
       * @param {sap.m.ObjectListItem} oItem selected Item
       * @private
       */
      _showObject: function (oItem) {
        this.getRouter().navTo("object", {
          objectId: oItem
            .getBindingContext()
            .getPath()
            .substring("/Z270FREECRUD1Set".length),
        });
      },

      /**
       * Internal helper method to apply both filter and search state together on the list binding
       * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
       * @private
       */
      _applySearch: function (aTableSearchState) {
        var oTable = this.byId("table"),
          oViewModel = this.getModel("worklistView");
        oTable.getBinding("items").filter(aTableSearchState, "Application");
        // changes the noDataText of the list in case there are no filter results
        if (aTableSearchState.length !== 0) {
          oViewModel.setProperty(
            "/tableNoDataText",
            this.getResourceBundle().getText("worklistNoDataWithSearchText")
          );
        }
      },
    });
  }
);
