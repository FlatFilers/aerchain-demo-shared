import api from "@flatfile/api";
import { FlatfileListener, FlatfileEvent } from "@flatfile/listener";

// Function to auto-fill reference sheets when a workbook is created
export function fetchReferences() {
  // Event listener for when a workbook is created
  return (listener: FlatfileListener) => {
    listener.on("workbook:created", async (event: FlatfileEvent) => {
      const workbook = await api.workbooks.get(event.context.workbookId);
      const workbookName = workbook.data.name;
      const sheets = workbook.data.sheets;
      try {
        if (workbookName.includes("Aerchain - Product Import")) {
          const categoriesSheet = sheets.find((s) =>
            s.config.slug.includes("categories")
          );

          const commoniditesSheet = sheets.find((s) =>
            s.config.slug.includes("commodities")
          );

          let result = [];

          const { parse } = require("csv-parse");
          const fs = require("fs");

          const catPath = "src/data/categories.csv";
          const csvData = await fs
            .createReadStream(catPath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
              result.push(row);
            })
            .on("error", function (error) {
              console.log(error.message);
            })
            .on("end", function () {
              if (categoriesSheet && Array.isArray(result)) {
                const categoriesId = categoriesSheet.id;
                const mappedCategories = result.map(
                  ([
                    serialNumber,
                    name,
                    reference,
                    parentCategory,
                    description,
                    enableProductAddition,
                  ]) => ({
                    serialNumber: { value: serialNumber },
                    name: { value: name },
                    reference: { value: reference },
                    parentCategory: { value: parentCategory },
                    description: { value: description },
                    "enable-product-addition": { value: enableProductAddition },
                  })
                );
                try {
                  const insertCategories = api.records.insert(
                    categoriesId,
                    mappedCategories
                  );
                } catch (error) {
                  console.error("Error inserting Categories:", error.message);
                }
              }
            });

          let comResult = [];
          const comPath = "src/data/commodities.csv";
          const comData = await fs
            .createReadStream(comPath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
              comResult.push(row);
            })
            .on("error", function (error) {
              console.log(error.message);
            })
            .on("end", function () {
              if (commoniditesSheet && Array.isArray(comResult)) {
                const commoditiesId = commoniditesSheet.id;
                const mappedCommodities = comResult.map(
                  ([commodity, uom, subCommodity, subUnit]) => ({
                    commodity: { value: commodity },
                    uom: { value: uom },
                    subCommodity: { value: subCommodity },
                    subUnit: { value: subUnit },
                  })
                );
                try {
                  const insertCommodities = api.records.insert(
                    commoditiesId,
                    mappedCommodities
                  );
                } catch (error) {
                  console.error("Error inserting Commodities:", error.message);
                }
              }
            });
        }
      } catch (e) {
        console.trace(e);
        throw e;
      }
    });
  };
}
