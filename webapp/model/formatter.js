sap.ui.define(["sap/ui/core/format/NumberFormat"], function (NumberFormat) {
  "use strict";

  return {
    /**
     * Rounds the number unit value to 2 digits
     * @public
     * @param {string} sValue the number string to be rounded
     * @returns {string} sValue with 2 digits rounded
     **/
    // numberUnit: function (sValue) {
    //   if (!sValue) {
    //     return "0";
    //   }
    //   return parseFloat(sValue).toFixed(2);
    // },

    formatarFloat: function (iv_valor) {
      debugger;
      var oFloatNumberFormat = NumberFormat.getFloatInstance(
        {
          maxFractionDigits: 2,
          minFractionDigits: 2,
          groupingEnabled: true,
        },
        sap.ui.getCore().getConfiguration().getLocale()
      );
      debugger;
      return oFloatNumberFormat.format(iv_valor);
    },
    formatarQtde: function (iv_valor) {
      debugger;
      // if the value of fMeasure is not a number, no status will be set
      if (isNaN(iv_valor)) {
        return "";
      } else {
        if (parseFloat(iv_valor) < 5) {
          return "Error";
        } else if (parseFloat(iv_valor) <= 10) {
          return "Warning";
        } else {
          return "Success";
        }
      }
    },

    // var Formatter = {
    //   formatarValor: function (iv_valor) {
    //     debugger;
    //     // if the value of fMeasure is not a number, no status will be set
    //     if (isNaN(iv_valor)) {
    //       return "";
    //     } else {
    //       if (parseFloat(iv_valor) < 5) {
    //         return "Error";
    //       } else if (parseFloat(iv_valor) <= 10) {
    //         return "Warning";
    //       } else {
    //         return "Success";
    //       }
    //     }
    //   },
    // };
    // return Formatter;
  };
});
