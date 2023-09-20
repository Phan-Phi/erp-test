import { Row } from "react-table";
import React, { useState, useCallback, useRef } from "react";

import unset from "lodash/unset";
import cloneDeep from "lodash/cloneDeep";

type UserMutateTableProps = {
  callback?: (...args: any[]) => void;
};

const useMutateTable = (props?: UserMutateTableProps) => {
  if (props == undefined) {
    props = {};
  }
  const { callback } = props;

  const data = useRef<{
    [key: number]: any;
  }>({});

  const [activeEditRow, setActiveEditRow] = useState<{
    [key: string]: boolean;
  }>({});
  const [updateLoading, setUpdateLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteLoading, setDeleteLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const activeEditRowHandler = useCallback((row: Row<{ id: number }>) => {
    return (e: React.SyntheticEvent) => {
      e?.stopPropagation?.();

      const id = row.original.id;

      setActiveEditRow((prev) => {
        return { ...prev, [id]: true };
      });
    };
  }, []);

  const updateEditRowDataHandler = useCallback(
    ({
      value,
      row,
      keyName,
    }: {
      value: any;
      row: Row<{ id: number }>;
      keyName: string;
    }) => {
      const id = row.original.id;

      data.current = {
        ...data.current,
        [id]: {
          ...data.current[id],
          [keyName]: value,
        },
      };

      callback?.(row);
    },
    [data, callback]
  );

  const removeEditRowDataHandler = useCallback((rows: Row<{ id: number }>[]) => {
    return () => {
      const idList = rows.map((el) => {
        return el.original.id;
      });

      const cloneActiveEditRow = cloneDeep(data.current);

      idList.forEach((el) => {
        unset(cloneActiveEditRow, el);
      });

      data.current = cloneActiveEditRow;

      setActiveEditRow((prev) => {
        const cloneActiveEditRow = cloneDeep(prev);

        idList.forEach((el) => {
          unset(cloneActiveEditRow, el);
        });

        return cloneActiveEditRow;
      });
    };
  }, []);

  const resetEditRowHandler = useCallback(() => {
    data.current = {};
    setActiveEditRow({});
    setUpdateLoading({});
    setDeleteLoading({});
  }, []);

  return {
    data,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    updateLoading,
    deleteLoading,
    setUpdateLoading,
    setDeleteLoading,
    resetEditRowHandler,
  } as const;
};

export default useMutateTable;
