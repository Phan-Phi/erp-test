import { Range } from "react-date-range";
import { TablePaginationProps } from "@mui/material";
import { Column, ColumnInstance, Row } from "react-table";

export type ChoiceItem = [string, string];

const ChoiceKey = [
  "genders",
  "draft_customer_states",
  "product_attribute_types",
  "purchase_order_statuses",
  "receipt_order_statuses",
  "return_order_statuses",
  "stock_out_note_statuses",
  "transaction_target_types",
  "transaction_statuses",
  "debt_source_types",
  "transaction_source_types",
  "transaction_flow_types",
  "creditor_types",
  "shipping_method_types",
  "voucher_types",
  "order_statuses",
  "invoice_statuses",
  "shipping_statuses",
  "discount_types",
  "permission_content_types",
  "currencies",
  "countries",
  "export_file_job_statuses",
  "export_file_types",
  "export_file_extensions",
  "export_file_event_types",
  "export_file_invoice_quantity_fields",
  "export_file_transaction_fields",
  "report_period_units",
] as const;

export type ChoiceType = {
  [key in (typeof ChoiceKey)[number]]: ChoiceItem[];
};

export interface CommonTableProps<T> {
  data: T[];
  count: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: TablePaginationProps["onRowsPerPageChange"];
  pagination: {
    pageSize: number;
    pageIndex: number;
  };
  isLoading?: boolean;
  maxHeight?: number | string;
}

export interface CommonFilterTableProps<T> {
  filter: T;
  resetFilter: () => void;
  onDateStartChange?: (value: any) => void;
  onDateEndChange?: (value: any) => void;
  onFilterByTime?: () => void;
  onDateRangeChange?: (range: Range) => void;
}

export interface ActionTableProps<T extends Record<string, any>> {
  row: Row<T>;
  column: ColumnInstance<T>;
}

export type ProvinceTuple = ChoiceItem;
export type DistrictTuple = ChoiceItem;
export type WardTuple = ChoiceItem;

export * from "./responseSchema";
export * from "./UseFetch";
