import { Fragment } from "react";
import { usePopupState, bindToggle, bindPopover } from "material-ui-popup-state/hooks";

import {
  Paper,
  MenuItem,
  ListItemText,
  Checkbox,
  Box,
  IconButton,
  Popover,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { IndeterminateCheckbox } from "./IndeterminateCheckbox";

const ColumnFilter = ({
  popupId = "filterPopper",
  getToggleHideAllColumnsProps,
  allColumns,
}) => {
  const popupState = usePopupState({ variant: "popover", popupId });

  return (
    <Fragment>
      <IconButton variant="contained" {...bindToggle(popupState)}>
        <FilterAltIcon />
      </IconButton>

      <Popover
        {...bindPopover(popupState)}
        style={{ zIndex: 3 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper
          sx={{
            minHeight: "200px",
            maxHeight: "300px",
            overflow: "auto",
          }}
        >
          <Box>
            {<IndeterminateCheckbox hasText={true} {...getToggleHideAllColumnsProps()} />}
            {allColumns.map((column) => {
              if (
                column.id === "selection" ||
                column.id === "action" ||
                column.id === "primary_image"
              ) {
                return null;
              }

              const getToggleHiddenProps = column.getToggleHiddenProps();
              return (
                <MenuItem key={column.id} value={column.id} {...getToggleHiddenProps}>
                  <Checkbox checked={getToggleHiddenProps.checked} />
                  <ListItemText
                    primary={column.Header}
                    onClick={(e) => {
                      if (e.target.closest(".MuiMenuItem-root")) {
                        e.target
                          .closest(".MuiMenuItem-root")
                          .querySelector("input")
                          .click();
                      }
                    }}
                  />
                </MenuItem>
              );
            })}
          </Box>
        </Paper>
      </Popover>
    </Fragment>
  );
};

export default ColumnFilter;
