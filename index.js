const fs = require("fs");
const [, , sales, prices] = process.argv;

const uploadFiles = (sales, prices) => {
  ventasToJson(sales, prices);
};

const ventasToJson = (sales, prices) => {
  const pathVentas = sales;
  const pathPrecios = prices;
  fs.readFile(pathVentas, "utf-8", (error, sales) => {
    if (error) {
      throw error;
    }
    const csvToJson = (sales) => {
      const lines = sales.split("\r");
      const columns = lines[0].split(";");
      return lines.slice(1).map((line) => {
        return line.split(";").reduce((acc, cur, i) => {
          const ventasToJson = {};
          ventasToJson[columns[i]] = cur;
          return { ...acc, ...ventasToJson };
        }, {});
      });
    };
    fs.readFile(pathPrecios, "utf-8", (error, prices) => {
      const jsonSales = csvToJson(sales);
      let jsonPrices = JSON.parse(prices);
      showData(jsonPrices, jsonSales);
    });
  });
};

const showData = (jsonPrices, jsonSales) => {
  console.log("------------------------");
  console.log("         PRECIOS        ");
  console.log("------------------------");
  console.log(jsonPrices);
  console.log("------------------------");
  console.log("        VENTAS          ");
  console.log("------------------------");
  console.log(jsonSales);
  console.log("------------------------");
  console.log("        BENEFICIOS      ");
  console.log("------------------------");
  unifiesSales(jsonSales, jsonPrices);
};

const unifiesSales = (jsonSales, jsonPrices) => {
  const prices = jsonPrices.categories;
  const categories = [...new Set(jsonSales.map((item) => item.CATEGORY))];
  const unifyRepeated = categories.map((acc) => {
    const filter = jsonSales.filter((rep) => {
      return rep.CATEGORY === acc;
    });
    const filterByCategory = filter.reduce((acc, sum) => {
      return {
        ...sum,
        QUANTITY: parseInt(sum.QUANTITY) + parseInt(acc.QUANTITY),
      };
    });
    return filterByCategory;
  });

  calculateBenefits(prices, unifyRepeated);
};

const calculateBenefits = (margen, unifyRepeated) => {
  const filterFormula = unifyRepeated.map((filt) => {
    for (const property in margen) {
      if (filt.CATEGORY === property) {
        return {
          ...filt,
          FORMULA: margen[property],
        };
      } else if (!margen.hasOwnProperty(filt.CATEGORY)) {
        return {
          ...filt,
          FORMULA: margen["*"],
        };
      }
    }
  });
  const applyFormula = filterFormula.map((met) => {
    var quantity = met.QUANTITY;
    let cost = met.COST.split("€");
    if (met.FORMULA.includes("%") && met.FORMULA.includes("€")) {
      let method = met.FORMULA.split("%");
      let valueMethod = method[0].split("+");
      let method2 = method[1].split("€");
      let metod2Percentage = method2[0].split("-");
      var constNumber = Number(cost[0]);
      var percentage = (Number(valueMethod[1]) / constNumber) * constNumber;
      var totalBenefit =
        (percentage - Number(metod2Percentage[1])) * Number(quantity);
      console.log(met.CATEGORY, ":", totalBenefit.toFixed(2));
      return {
        [met.CATEGORY]: totalBenefit.toFixed(2),
      };
    } else if (met.FORMULA.includes("%")) {
      let method = met.FORMULA.split("%");
      let costFormat = cost[0].replace(/\./g, "");
      let formatCost = costFormat.replace(",", ".");
      var formatQuantity = quantity.replace(/\./g, "");
      let finalCost = Number(formatCost);
      var finalQuantity = Number(formatQuantity);
      if (method[0].includes("+")) {
        let sum = method[0].split("+");
        let formula = Number(sum[1]);
        var profitPercentage = (finalCost / 100) * formula;
        var totalBenefit = profitPercentage * finalQuantity;
        console.log(met.CATEGORY, ":", totalBenefit.toFixed(2));
        return {
          [met.CATEGORY]: totalBenefit.toFixed(2),
        };
      } else {
        let subtraction = metodo[0].split("-");
        let formula = Number(subtraction[1]);
        var profitPercentage = (numero / 100) * formula;
        var totalBenefit = profitPercentage * final;
        console.log(met.CATEGORY, ":", totalBenefit.toFixed(2));
        return {
          [met.CATEGORY]: totalBenefit.toFixed(2),
        };
      }
    } else if (met.FORMULA.includes("€")) {
      let method = met.FORMULA.split("€");
      if (method[0].includes("+")) {
        let sum = method[0].split("+");
        let formula = Number(sum[1]);
        var totalBenefit = quantity * formula;
        console.log(met.CATEGORY, ":", totalBenefit.toFixed(2));
        return {
          [met.CATEGORY]: totalBenefit.toFixed(2),
        };
      }
    }
  });
};

uploadFiles(sales, prices);
