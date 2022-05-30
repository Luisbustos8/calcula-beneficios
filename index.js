const fs = require("fs");
// const { format } = require("path");
const [, , sales, prices] = process.argv;

const UploadFiles = (sales, prices) => {
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
};

UploadFiles(sales, prices);
