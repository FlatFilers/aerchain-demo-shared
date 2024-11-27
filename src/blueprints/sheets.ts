import { Flatfile } from "@flatfile/api";

export const products: Flatfile.SheetConfig = {
  name: "Products",
  slug: "products",
  fields: [
    {
      key: "serialNumber",
      type: "number",
      label: "Serial Number",
      constraints: [
        {
          type: "required",
        },
        {
          type: "unique",
        },
      ],
    },
    {
      key: "name",
      type: "string",
      label: "Name",
      constraints: [
        {
          type: "required",
        },
      ],
    },
    {
      key: "unit",
      type: "enum",
      label: "Unit",
      constraints: [
        {
          type: "required",
        },
      ],
      config: {
        options: [
          {
            value: "Kilogram",
            label: "Kilogram",
          },
          {
            value: "Each",
            label: "Each",
          },
          {
            value: "Box",
            label: "Box",
          },
          {
            value: "Carton",
            label: "Carton",
          },
        ],
      },
    },
    {
      key: "createdDate",
      type: "date",
      label: "Created Date",
    },
    {
      key: "stdCostUpdated",
      type: "number",
      label: "Std Cost Updated",
    },
    {
      key: "category",
      type: "reference",
      label: "Category",
      config: {
        ref: "categories",
        key: "name",
        relationship: "has-one",
      },
    },
    {
      key: "enableAssetTracking",
      type: "boolean",
      label: "Enable Asset Tracking",
    },
    {
      key: "notes",
      type: "string",
      label: "Notes",
    },
    {
      key: "commodityCode",
      type: "reference",
      label: "Commodity Code",
      config: {
        ref: "commodities",
        key: "commodity",
        relationship: "has-one",
      },
    },
    {
      key: "Sub CommodityCode",
      type: "reference",
      label: "Sub CommodityCode",
      config: {
        ref: "commodities",
        key: "subCommodity",
        relationship: "has-one",
      },
    },
    {
      key: "productLineSegment",
      type: "string",
      label: "Product Line Segment",
    },
    {
      key: "foreignName",
      type: "string",
      label: "Foreign Name",
    },
    {
      key: "glAccountCode",
      type: "string",
      label: "GL Account Code",
    },
  ],
  actions: [
    {
      operation: "auto-fix",
      mode: "background",
      label: "Autofix",
      primary: true,
    },
  ],
};

export const categories: Flatfile.SheetConfig = {
  name: "Categories",
  slug: "categories",
  fields: [
    {
      key: "serialNumber",
      type: "string",
      label: "Serial Number",
      constraints: [
        {
          type: "required",
        },
        {
          type: "unique",
        },
      ],
    },
    {
      key: "name",
      type: "string",
      label: "Name",
      constraints: [
        {
          type: "required",
        },
      ],
    },
    {
      key: "reference",
      type: "string",
      label: "Reference",
    },
    {
      key: "parentCategory",
      type: "string",
      label: "Parent Category",
    },
    {
      key: "description",
      type: "string",
      label: "Description",
    },
    {
      key: "enable-product-addition",
      type: "boolean",
      label: "Enable Product Addition",
    },
  ],
};

export const commodities: Flatfile.SheetConfig = {
  slug: "commodities",
  name: "Commodities",
  fields: [
    {
      key: "commodity",
      type: "string",
      label: "Commodity",
      constraints: [
        {
          type: "required",
        },
        {
          type: "unique",
        },
      ],
    },
    {
      key: "uom",
      type: "enum",
      label: "UOM",
      constraints: [
        {
          type: "required",
        },
      ],
      config: {
        options: [
          {
            value: "Kilogram",
            label: "Kilogram",
          },
          {
            value: "Each",
            label: "Each",
          },
          {
            value: "Box",
            label: "Box",
          },
          {
            value: "Carton",
            label: "Carton",
          },
        ],
      },
    },
    {
      key: "subCommodity",
      type: "string",
      label: "Sub Commodity",
    },
    {
      key: "subUnit",
      type: "string",
      label: "Sub Unit",
    },
  ],
};
