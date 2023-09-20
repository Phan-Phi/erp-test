import { useTable as useTableOriginal, TableOptions, PluginHook } from "react-table";

export interface ExtendTableOptions<T extends Record<string, unknown>>
  extends TableOptions<T> {
  hooks?: PluginHook<T>[];
  additionalFunction?: Record<string, unknown>;
}

export const useTable = <T extends Record<string, unknown>>(
  props: ExtendTableOptions<T>
) => {
  const { hooks = [], additionalFunction = {}, initialState = {}, ...restProps } = props;

  const tableInstance = useTableOriginal<T>(
    {
      manualPagination: true,
      autoResetPage: false,
      initialState: {
        ...initialState,
      },
      ...restProps,
      ...additionalFunction,
    },
    ...hooks
  );

  return tableInstance;
};
