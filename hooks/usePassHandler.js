import { useCallback } from "react";

const usePassHandler = ({ setParams = () => {}, setMutate }) => {
  const callback = useCallback(
    ({ page, pageSize, mutate, selectedFlatRows, search, ...props }) => {
      if (page && pageSize && mutate) {
        const params = {
          page,
          page_size: pageSize,
          use_cache: false,
        };

        setParams({
          ...params,
        });

        setMutate((prev) => {
          return {
            ...prev,
            mutate,
          };
        });
      }

      if (selectedFlatRows) {
        setMutate((prev) => {
          return {
            ...prev,
            selectedFlatRows,
          };
        });
      }

      if (search !== undefined) {
        setParams({
          search,
          page: 1,
        });
      }
    },
    [setParams, setMutate]
  );

  return callback;
};

export default usePassHandler;
