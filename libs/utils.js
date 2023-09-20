import originalSlugify from "slugify";
import queryString from "query-string";

import { Avatar } from "@mui/material";

import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

import get from "lodash/get";
import unset from "lodash/unset";
import times from "lodash/times";
import isEmpty from "lodash/isEmpty";

import IndeterminateCheckbox from "../components/IndeterminateCheckbox";

export const slugify = (value, option) => {
  return originalSlugify(value, {
    lower: true,
    trim: true,
    replacement: "-",
    locale: "vi",
    strict: true,
    ...option,
  });
};

export const createNotistackMessage = (obj, cb) => {
  if (isEmpty(obj) || typeof obj !== "object") {
    cb("Lỗi server vui lòng thử lại sau", {
      variant: "error",
    });
    return;
  }

  for (let key of Object.keys(obj)) {
    if (Array.isArray(obj[key])) {
      cb(`${key}: ${obj[key].join(" ")}`, {
        variant: "error",
      });
    } else {
      cb(`${key}: ${obj[key]}`, {
        variant: "error",
      });
    }
  }
};

export const createInitDataTable = (keys, repeat) => {
  let obj = {};

  for (let el of keys) {
    obj[el] = "";
  }

  return times(repeat, obj);
};

// using at province, district, ward

export const convertArrayElementToObject = (arr = []) => {
  return arr.map((el) => {
    return {
      value: el[0],
      displayName: el[1],
    };
  });
};

export const createGenderList = (choice) => {
  let genders = [];

  choice.genders.forEach((el) => {
    genders.push({
      value: el[0],
      displayValue: el[1],
    });
  });

  return genders;
};

export const createStatusList = (choice) => {
  let statusList = [];

  choice.draft_customer_states.forEach((el) => {
    statusList.push({
      value: el[0],
      displayValue: el[1],
    });
  });

  return statusList;
};

export const createSelectTypeList = (choice) => {
  let list = [];

  choice.product_attribute_types.forEach((el) => {
    list.push({
      value: el[0],
      displayValue: el[1],
    });
  });

  return list;
};

export const checkResArr = (arr) => {
  return arr.reduce((result, res) => {
    let status = get(res, "status");

    if (status < 200 && status > 300) {
      return false;
    } else {
      return result;
    }
  }, true);
};

export const checkRes = (resData, enqueueSnackbar) => {
  let status;

  if (resData.status === "success") {
    status = "success";
  } else {
    status = "error";
    createNotistackMessage(resData.message, enqueueSnackbar);
  }

  return status;
};

export const decorateSelection = (column, loading) => {
  column.disableSortBy = true;

  column.TableCellProps = {
    sx: {
      minWidth: 64,
      maxWidth: 64,
      width: 64,
    },
  };

  column.Header = ({ getToggleAllPageRowsSelectedProps }) => {
    return <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />;
  };
  column.Cell = ({ row }) => {
    return (
      <IndeterminateCheckbox
        onClick={(e) => {
          e.stopPropagation();
        }}
        {...row.getToggleRowSelectedProps()}
      />
    );
  };

  return column;
};

export const decorateProductAvatar = (column, imagePath, alterImagePath) => {
  if (!column || !imagePath) {
    return;
  }

  column.TableCellProps = {
    sx: {
      minWidth: 64,
      maxWidth: 64,
      width: 64,
    },
  };

  column.WrapperCellProps = {
    sx: {
      justifyContent: "center",
    },
  };

  column.Header = () => {
    return "";
  };

  column.Cell = ({ row }) => {
    let value = get(row, imagePath);

    if (value === undefined) {
      value = get(row, alterImagePath);
    }

    if (
      process.env.NODE_ENV === "development" &&
      value &&
      !value.includes("localhost:8000")
    ) {
      value = value.replace("localhost", "localhost:8000");
    }

    if (value) {
      return (
        <Avatar
          variant="square"
          src={value}
          sx={{
            width: 32,
            height: 32,
          }}
        />
      );
    } else {
      return (
        <Avatar
          variant="square"
          sx={{
            width: 32,
            height: 32,
          }}
        >
          <WorkOutlineIcon />
        </Avatar>
      );
    }
  };

  return column;
};

export const decorateError = ({ statusCode = null, router, pathname }) => {
  if (!router || !pathname) {
    return;
  }

  if (statusCode === 404) {
    router.replace(pathname, pathname, { shallow: true });
  } else if (statusCode === 403) {
    router.push("/logout", "/logout", { shallow: true });
  }
};

export const factoryPassHandler = (
  setInternalFilter,
  setExternalFilter,
  router,
  originalFilter
) => {
  return (type, pathname) => {
    return ({ value }) => {
      if (type === "resetFilter") {
        const pathname = router.pathname;

        setInternalFilter(originalFilter);
        setExternalFilter(originalFilter);

        router.push(pathname, pathname);

        return;
      }

      if (type.includes("range")) {
        setInternalFilter((prev) => {
          return {
            ...prev,
            ...value,
          };
        });
      } else {
        setInternalFilter((prev) => {
          return {
            ...prev,
            [type]: value,
          };
        });
      }

      if (value === null) {
        setExternalFilter((prev) => {
          return {
            ...prev,
            [type]: value,
          };
        });

        const paramObj = {
          ...router.query,
        };

        unset(paramObj, type);

        const stringifyParams = queryString.stringify(paramObj);

        router.push(
          `${router.pathname}?${stringifyParams}`,
          `${router.pathname}?${stringifyParams}`
        );

        return;
      }

      let paramObj = {};

      if (type.includes("range")) {
        setExternalFilter((prev) => {
          return {
            ...prev,
            ...value,
          };
        });

        paramObj = {
          ...router.query,
          ...value,
        };
      } else {
        setExternalFilter((prev) => {
          return {
            ...prev,
            [type]: pathname ? value[pathname] : value,
          };
        });

        paramObj = {
          ...router.query,
          [type]: pathname ? value[pathname] : value,
        };
      }

      const stringifyParams = queryString.stringify(paramObj);

      router.push(
        `${router.pathname}?${stringifyParams}`,
        `${router.pathname}?${stringifyParams}`
      );
    };
  };
};

export const factoryRemoveEditRowHandler = (setEditDataRow, setEditRow) => {
  return (row) => {
    return (e) => {
      e.stopPropagation();

      setEditDataRow((prev) => {
        unset(prev, row.original.id);
        return prev;
      });

      setEditRow((prev) => {
        return {
          ...prev,
          [row.original.id]: false,
        };
      });
    };
  };
};

export const factoryEditDataRowHandler = (setEditDataRow) => {
  return (row, column, data) => {
    let id = row.original.id;

    setEditDataRow((prev) => {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [column]: data,
        },
      };
    });
  };
};

export const factoryEditRowHandler = (setEditRow) => {
  return (row) => {
    return (e) => {
      e.stopPropagation();

      setEditRow((prev) => {
        return {
          ...prev,
          [row.original.id]: true,
        };
      });
    };
  };
};

export const createLoadingList = (data) => {
  let trueLoadingList = {};
  let falseLoadingList = {};
  let list = [];

  data.forEach((el) => {
    falseLoadingList[el.original.id] = false;
    trueLoadingList[el.original.id] = true;
    list.push(el.original.id);
  });

  return {
    trueLoadingList,
    falseLoadingList,
    list,
  };
};
