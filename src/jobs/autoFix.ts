import api from "@flatfile/api";
import { jobHandler } from "@flatfile/plugin-job-handler";
import { Simplified } from "@flatfile/util-common";
import * as chrono from "chrono-node";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

// Job handler for the "sheet:auto-fix" event
export default jobHandler("sheet:auto-fix", async ({ context }, tick) => {
  const { jobId, sheetId } = context;

  try {
    const updates = [];
    const delete_ids = [];

    const records = await Simplified.getAllRecords(sheetId);

    records.forEach((record) => {
      const newRecord: Record<string, any> = { _id: record._id };
      let updateRecord = false;
      const createdDate = record.createdDate as string;
      const stdCostUpdated = record.stdCostUpdated as string;

      // Normalize the createdDate field if it exists
      if (createdDate) {
        const normalizedDate = normalizeDate(createdDate);
        console.log({ normalizedDate });
        if (normalizedDate) {
          newRecord["createdDate"] = normalizedDate;
          updateRecord = true;
        }
      }

      // Normalize the stdCostUpdated field if it exists
      if (stdCostUpdated) {
        console.log("in if");
        const normalizedCost = parseFloat(stdCostUpdated).toFixed(2);
        console.log({ normalizedCost });
        if (normalizedCost) {
          newRecord["stdCostUpdated"] = normalizedCost;
          updateRecord = true;
        }
      }
      console.log({ updateRecord });
      if (updateRecord) {
        updates.push(newRecord);
      }
    });
    await Simplified.updateAllRecords(sheetId, updates as any);
    if (delete_ids.length > 0) {
      await api.records.delete(sheetId, { ids: delete_ids });
    }
    await api.jobs.complete(jobId, { info: "Completed processing records" });
  } catch (error) {
    await api.jobs.fail(jobId, { info: "Failed processing records" });
  }
});

export interface DateFormatNormalizerConfig {
  sheetSlug?: string;
  dateFields: string[];
  outputFormat: string;
  includeTime: boolean;
  locale?: string;
}

export function normalizeDate(dateString: string): string | null {
  try {
    const parsedDate = chrono.parseDate(dateString);
    if (parsedDate) {
      const formattedDate = format(parsedDate, "MM/dd/yyyy", {
        locale: enUS,
      });

      // If time should not be included, truncate the formatted date to just the date part
      return formattedDate.split(" ")[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
