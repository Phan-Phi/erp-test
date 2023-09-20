import useSWR from "swr";
import { Row } from "react-table";
import { useMeasure, useUpdateEffect } from "react-use";

import React, {
  useCallback,
  useRef,
  useState,
  Fragment,
  useMemo,
  useEffect,
} from "react";

import { Stack, alpha, Box } from "@mui/material";

import get from "lodash/get";

import { REPORT_PRODUCT_WITH_REVENUE, REPORT_PRODUCT_WITH_IO_INVENTORY } from "apis";
import {
  REPORT_PRODUCT_WITH_REVENUE_ITEM,
  REPORT_PRODUCT_WITH_IO_INVENTORY_ITEM,
} from "interfaces";

import {
  TableRow,
  TableView,
  CompoundTableWithFunction,
  ExtendableTableInstanceProps,
} from "components/TableV2";

import {
  TableCell,
  BackButton,
  NumberFormat,
  LoadingDynamic as Loading,
} from "components";

import { transformUrl } from "libs";
import { useFetch, useFetchAllData, useLayout } from "hooks";
import { ListingInvoice } from "./ListingInvoice";
import { ListingWarehouse } from "./ListingWarehouse";
import ProductReportColumnBySale from "./ProductReportColumnBySale";
import ProductReportColumnByProfit from "./ProductReportColumnByProfit";
import ProductReportColumnByWarehouseValue from "./ProductReportColumnByWarehouseValue";
import ProductReportColumnByImportExportStock from "./ProductReportColumnByImportExportStock";
import Column from "./Column";

interface ProductReportByTableProps {
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "warehouse_value" | "import_export_stock";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
}

type TView = "general" | "listingByTime";

export const ProductReportByTable = (props: ProductReportByTableProps) => {
  const {
    filter,
    isPrinting,
    onIsDoneHandler,
    viewType: _viewType,
    onPageSizeChange,
    onPageChange,
  } = props;
  const { state: layoutState } = useLayout();
  const [ref, { height }] = useMeasure();
  const [reload, setReload] = useState(false);

  const [variantData, setVariantData] = useState<REPORT_PRODUCT_WITH_REVENUE_ITEM>();
  const [variantSku, setVariantSku] = useState<string>();

  const { data } = useSWR(() => {
    if (props.viewType === "sale" || props.viewType === "profit") {
      return transformUrl(REPORT_PRODUCT_WITH_REVENUE, {
        ...filter,
        with_sum_net_revenue_incl_tax: true,
        with_sum_revenue_incl_tax: true,
        with_sum_base_amount_incl_tax: true,
        with_sum_quantity: true,
        page_size: 1,
      });
    }
  });

  const { data: reportProductWithIoInventoryData } = useSWR(() => {
    if (
      props.viewType === "warehouse_value" ||
      props.viewType === "import_export_stock"
    ) {
      return transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, {
        ...filter,
        page_size: 1,
        with_sum_input_quantity: true,
        with_sum_output_quantity: true,
        with_sum_beginning_amount: true,
        with_sum_beginning_quantity: true,
        with_sum_total_input_amount: true,
        with_sum_total_output_amount: true,
        with_sum_current_price_incl_tax: true,
        with_sum_current_base_price_incl_tax: true,
        with_total_current_price_incl_tax_till_date_end: true,
        with_total_current_base_price_incl_tax_till_date_end: true,
      });
    }
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
    changeKey,
  } = useFetch<any>(transformUrl(REPORT_PRODUCT_WITH_REVENUE, filter));

  const [viewType, setViewType] = useState<TView>("general");

  const tableInstance = useRef<ExtendableTableInstanceProps<any>>();

  const { data: reportDataForPrinting, setUrl, isDone } = useFetchAllData();

  useEffect(() => {
    if (_viewType === "sale" || _viewType === "profit") {
      changeKey(transformUrl(REPORT_PRODUCT_WITH_REVENUE, filter));
    }

    if (_viewType === "warehouse_value" || _viewType === "import_export_stock") {
      changeKey(transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, filter));
    }
  }, [filter, _viewType]);

  useUpdateEffect(() => {
    if (variantSku) return;

    if (!isPrinting) return;

    tableInstance.current && setUrl(tableInstance.current.url);
  }, [isPrinting, variantSku]);

  useUpdateEffect(() => {
    if (variantSku) return;

    isDone && onIsDoneHandler();
  }, [isDone, variantSku]);

  const passHandler = useCallback((_tableInstance: ExtendableTableInstanceProps<any>) => {
    tableInstance.current = _tableInstance;
  }, []);

  useUpdateEffect(() => {
    if (tableInstance.current) {
      const setUrl = tableInstance.current.setUrl;

      if (viewType === "general") {
        if (props.viewType === "sale" || props.viewType === "profit") {
          setUrl(transformUrl(REPORT_PRODUCT_WITH_REVENUE, filter));
        } else if (props.viewType === "warehouse_value") {
          setUrl(transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, filter));
        } else if (props.viewType === "import_export_stock") {
          setUrl(transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, filter));
        }
      }
    }
  }, [filter]);

  useUpdateEffect(() => {
    let timer: NodeJS.Timeout;

    setReload(true);

    setViewType("general");
    setVariantSku(undefined);

    timer = setTimeout(() => {
      setReload(false);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [props.viewType]);

  const onBackToGeneralHandler = useCallback(() => {
    setViewType("general");
  }, []);

  const onViewDetailHandler = useCallback(
    (row: Row<REPORT_PRODUCT_WITH_REVENUE_ITEM>) => {
      const sku = row.original.sku;

      setVariantData(row.original);

      setVariantSku(sku);

      setViewType("listingByTime");
    },
    []
  );

  const columnFn = useMemo(() => {
    const viewType = props.viewType;

    if (viewType === "sale") {
      return ProductReportColumnBySale;
    } else if (viewType === "profit") {
      return ProductReportColumnByProfit;
    } else if (viewType === "warehouse_value") {
      return ProductReportColumnByWarehouseValue;
    } else if (viewType === "import_export_stock") {
      return ProductReportColumnByImportExportStock;
    } else {
      return ProductReportColumnBySale;
    }
  }, [props.viewType]);

  const renderTotal = useMemo(() => {
    const viewType = props.viewType;

    if (viewType === "sale") {
      if (data == undefined) return null;

      return (
        <TableRow
          sx={{
            backgroundColor: ({ palette }) => {
              return `${alpha(palette.primary2.main, 0.25)} !important`;
            },
          }}
        >
          <TableCell
            sx={{
              fontWeight: 700,
            }}
            colSpan={2}
          >
            {"SL mặt hàng: "}

            <NumberFormat value={get(data, "count")} suffix="" />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={get(data, "sum_quantity")} suffix="" />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_revenue_incl_tax"))} />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_net_revenue_incl_tax"))} />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "profit") {
      if (data == undefined) return null;

      return (
        <TableRow
          sx={{
            backgroundColor: ({ palette }) => {
              return `${alpha(palette.primary2.main, 0.25)} !important`;
            },
          }}
        >
          <TableCell
            sx={{
              fontWeight: 700,
            }}
            colSpan={2}
          >
            {"SL mặt hàng: "}

            <NumberFormat value={get(data, "count")} suffix="" />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_quantity"))} suffix="" />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_revenue_incl_tax"))} />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_net_revenue_incl_tax"))} />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={parseFloat(get(data, "sum_base_amount_incl_tax"))} />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  get(data, "sum_net_revenue_incl_tax") -
                  get(data, "sum_base_amount_incl_tax")
                ).toFixed(2)
              )}
            />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  ((parseFloat(get(data, "sum_net_revenue_incl_tax")) -
                    parseFloat(get(data, "sum_base_amount_incl_tax"))) /
                    parseFloat(get(data, "sum_net_revenue_incl_tax"))) *
                  100
                ).toFixed(2)
              )}
              suffix="%"
            />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "warehouse_value") {
      if (reportProductWithIoInventoryData == undefined) return null;

      const currentQuantity =
        get(reportProductWithIoInventoryData, "sum_beginning_quantity") +
        get(reportProductWithIoInventoryData, "sum_input_quantity") -
        get(reportProductWithIoInventoryData, "sum_output_quantity");

      return (
        <TableRow
          sx={{
            backgroundColor: ({ palette }) => {
              return `${alpha(palette.primary2.main, 0.25)} !important`;
            },
          }}
        >
          <TableCell
            sx={{
              fontWeight: 700,
            }}
            colSpan={2}
          >
            {"SL mặt hàng: "}

            <NumberFormat
              value={get(reportProductWithIoInventoryData, "count")}
              suffix=""
            />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat value={currentQuantity} suffix="" />
          </TableCell>

          <TableCell></TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                get(
                  reportProductWithIoInventoryData,
                  "total_current_price_incl_tax_till_date_end"
                )
              ).toFixed()}
            />
          </TableCell>

          <TableCell></TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                get(
                  reportProductWithIoInventoryData,
                  "total_current_base_price_incl_tax_till_date_end"
                )
              ).toFixed()}
            />
          </TableCell>
        </TableRow>
      );
    } else if (viewType === "import_export_stock") {
      if (reportProductWithIoInventoryData == undefined) {
        return null;
      }

      return (
        <TableRow
          sx={{
            backgroundColor: ({ palette }) => {
              return `${alpha(palette.primary2.main, 0.25)} !important`;
            },
          }}
        >
          <TableCell
            sx={{
              fontWeight: 700,
            }}
            colSpan={2}
          >
            {"SL mặt hàng: "}

            <NumberFormat
              value={get(reportProductWithIoInventoryData, "count")}
              suffix=""
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={get(reportProductWithIoInventoryData, "sum_beginning_quantity")}
              suffix=""
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                get(reportProductWithIoInventoryData, "sum_beginning_amount")
              )}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            {/* <NumberFormat
              value={get(reportProductWithIoInventoryData, "sum_input_quantity")}
              suffix=""
            /> */}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                get(reportProductWithIoInventoryData, "sum_total_input_amount")
              )}
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={get(reportProductWithIoInventoryData, "sum_output_quantity")}
              suffix=""
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                get(reportProductWithIoInventoryData, "sum_total_output_amount")
              )}
            />
          </TableCell>

          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  parseFloat(
                    get(reportProductWithIoInventoryData, "sum_beginning_quantity")
                  ) +
                  parseFloat(
                    get(reportProductWithIoInventoryData, "sum_input_quantity")
                  ) -
                  parseFloat(get(reportProductWithIoInventoryData, "sum_output_quantity"))
                ).toFixed(2)
              )}
              suffix=""
            />
          </TableCell>
          <TableCell
            sx={{
              textAlign: "right",
              fontWeight: 700,
            }}
          >
            <NumberFormat
              value={parseFloat(
                (
                  parseFloat(
                    get(reportProductWithIoInventoryData, "sum_beginning_amount")
                  ) +
                  parseFloat(
                    get(reportProductWithIoInventoryData, "sum_total_input_amount")
                  ) -
                  parseFloat(
                    get(reportProductWithIoInventoryData, "sum_total_output_amount")
                  )
                ).toFixed(2)
              )}
            />
          </TableCell>
        </TableRow>
      );
    }

    return null;
  }, [data, props.viewType, reportProductWithIoInventoryData]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (reload) return <Loading />;

  if (viewType === "general") {
    let component: React.ReactNode = null;

    if (props.viewType === "sale" || props.viewType === "profit") {
      if (data == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Fragment>
            <Column
              type={_viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ?? []}
              dataTotal={data ? [data] : []}
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              onViewDetailHandler={onViewDetailHandler}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
            />
          </Fragment>

          // <CompoundTableWithFunction<REPORT_PRODUCT_WITH_REVENUE_ITEM>
          //   url={transformUrl(REPORT_PRODUCT_WITH_REVENUE, filter)}
          //   columnFn={columnFn}
          //   passHandler={passHandler}
          //   onViewDetailHandler={onViewDetailHandler}
          //   renderBodyItem={(rows, tableInstance) => {
          //     if (rows == undefined) return null;

          //     return (
          //       <Fragment>
          //         {/* {renderTotal} */}

          //         {rows.map((row, i) => {
          //           tableInstance.prepareRow(row);

          //           return (
          //             <TableRow {...row.getRowProps()}>
          //               {row.cells.map((cell) => {
          //                 return (
          //                   <TableCell
          //                     {...cell.getCellProps()}
          //                     {...(cell.column.colSpan && {
          //                       colSpan: cell.column.colSpan,
          //                     })}
          //                     sx={{
          //                       width: cell.column.width,
          //                       minWidth: cell.column.minWidth,
          //                       maxWidth: cell.column.maxWidth,
          //                     }}
          //                   >
          //                     {cell.render("Cell")}
          //                   </TableCell>
          //                 );
          //               })}
          //             </TableRow>
          //           );
          //         })}
          //       </Fragment>
          //     );
          //   }}
          // />
        );
      }
    } else if (
      props.viewType === "warehouse_value" ||
      props.viewType === "import_export_stock"
    ) {
      if (reportProductWithIoInventoryData == undefined) {
        component = <Loading />;
      } else {
        component = (
          <Fragment>
            <Column
              type={_viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ?? []}
              dataTotal={
                reportProductWithIoInventoryData ? [reportProductWithIoInventoryData] : []
              }
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              onViewDetailHandler={onViewDetailHandler}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
            />
            {/* <CompoundTableWithFunction<REPORT_PRODUCT_WITH_IO_INVENTORY_ITEM>
              url={transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, filter)}
              columnFn={columnFn}
              passHandler={passHandler}
              onViewDetailHandler={onViewDetailHandler}
              renderBodyItem={(rows, tableInstance) => {
                if (rows == undefined) return null;

                return (
                  <Fragment>
                    {renderTotal}

                    {rows.map((row, i) => {
                      tableInstance.prepareRow(row);

                      return (
                        <TableRow {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            return (
                              <TableCell
                                {...cell.getCellProps()}
                                {...(cell.column.colSpan && {
                                  colSpan: cell.column.colSpan,
                                })}
                                sx={{
                                  width: cell.column.width,
                                  minWidth: cell.column.minWidth,
                                  maxWidth: cell.column.maxWidth,
                                }}
                              >
                                {cell.render("Cell")}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </Fragment>
                );
              }}
            /> */}
          </Fragment>
        );
      }
    }

    // else if (props.viewType === "import_export_stock") {
    //   component = (
    //     <CompoundTableWithFunction<REPORT_PRODUCT_WITH_IO_INVENTORY_ITEM>
    //       url={transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, filter)}
    //       columnFn={columnFn}
    //       passHandler={passHandler}
    //       renderBodyItem={(rows, tableInstance) => {
    //         if (rows == undefined) return null;

    //         return (
    //           <Fragment>
    //             {renderTotal}

    //             {rows.map((row, i) => {
    //               tableInstance.prepareRow(row);

    //               return (
    //                 <TableRow {...row.getRowProps()}>
    //                   {row.cells.map((cell) => {
    //                     return (
    //                       <TableCell
    //                         {...cell.getCellProps()}
    //                         {...(cell.column.colSpan && {
    //                           colSpan: cell.column.colSpan,
    //                         })}
    //                         sx={{
    //                           width: cell.column.width,
    //                           minWidth: cell.column.minWidth,
    //                           maxWidth: cell.column.maxWidth,
    //                         }}
    //                       >
    //                         {cell.render("Cell")}
    //                       </TableCell>
    //                     );
    //                   })}
    //                 </TableRow>
    //               );
    //             })}
    //           </Fragment>
    //         );
    //       }}
    //     />
    //   );
    // }
    return (
      <Fragment>
        <Box display={isPrinting ? "none" : "block"}>{component}</Box>
        <Box display={isPrinting ? "block" : "none"}>
          {isDone && (
            <TableView
              columns={columnFn()}
              data={reportDataForPrinting}
              prependChildren={renderTotal}
            />
          )}
        </Box>
      </Fragment>
    );
  } else if (viewType === "listingByTime") {
    if (!variantSku) return null;

    let component: React.ReactNode = null;

    if (props.viewType === "sale") {
      component = (
        <ListingInvoice
          variantSku={variantSku}
          filter={filter}
          viewType={props.viewType}
          isPrinting={isPrinting}
          onIsDoneHandler={onIsDoneHandler}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      );
    } else if (props.viewType === "warehouse_value" && variantData) {
      component = (
        <ListingWarehouse
          variantSku={variantSku}
          filter={filter}
          viewType={props.viewType}
          data={variantData}
          isPrinting={isPrinting}
          onIsDoneHandler={onIsDoneHandler}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      );
    }

    return (
      <Stack spacing={2}>
        <Box displayPrint="none">
          <BackButton
            onClick={onBackToGeneralHandler}
            sx={{
              alignSelf: "flex-start",
            }}
          />
        </Box>
        {component}
      </Stack>
    );
  }

  return null;
};
