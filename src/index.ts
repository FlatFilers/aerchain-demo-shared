import FlatfileListener, { FlatfileEvent } from "@flatfile/listener";
import { configureSpace } from "@flatfile/plugin-space-configure";
import { jobHandler } from "@flatfile/plugin-job-handler";
import { products, categories, commodities } from "./blueprints/sheets";
import autoFix from "./jobs/autoFix";
import { FlatfileRecord, bulkRecordHook } from "@flatfile/plugin-record-hook";
import { fetchReferences } from "./jobs/fetchReferences";

// Main function to configure the Flatfile listener
export default function (listener: FlatfileListener) {
  // Configure the space with workbooks and sheets
  listener.use(
    configureSpace({
      workbooks: [
        {
          name: "Aerchain - Product Import",
          sheets: [products, categories, commodities],
          actions: [
            {
              operation: "submitActionBg",
              mode: "background",
              label: "Submit",
              primary: true,
            },
          ],
        },
      ],
      space: {
        metadata: {
          theme: {
            root: {
              primaryColor: "#000000",
              actionColor: "#000000",
            },
            sidebar: {
              logo: "https://cdn.prod.website-files.com/6682cabfabc3d6652920ac6d/668425b6e4d8d8e8fc0e36b6_Aerchain_-_Light_Version-removebg-preview-p-500.png",
            },
          },
        },
      },
    })
  );

  // Handle the submit action
  // TODO: Add your own submit logic here
  listener.use(
    jobHandler("workbook:submitActionBg", async (event, tick) => {
      console.log(event);
    })
  );
  listener.use(fetchReferences());
  listener.use(autoFix);

  // Logic to validate and process records in the "products" sheet
  listener.use(
    bulkRecordHook("products", (records: FlatfileRecord[]) => {
      records.map((record) => {
        const createdDate = record.get("createdDate") as string;
        const stdCostUpdated = record.get("stdCostUpdated") as string;

        const dateRegex = /(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/;
        const priceRegex = /^\d{0,8}(\.\d{1,2})?$/;

        if (createdDate) {
          if (!dateRegex.test(createdDate)) {
            record.addError(
              "createdDate",
              `Dates must be in MM/DD/YYYY format`
            );
          }
        }
        if (stdCostUpdated) {
          if (!priceRegex.test(stdCostUpdated)) {
            record.addError("stdCostUpdated", `Price must be in 0.00 format`);
          }
        }

        return record;
      });
    })
  );
}
