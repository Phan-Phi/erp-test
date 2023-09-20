import { useState, Fragment } from "react";
import { useUpdateEffect } from "react-use";
import { useIntl } from "react-intl";
import { useFieldArray, useController } from "react-hook-form";

import { FormHelperText, ListItem, List, ListItemText, Input, Box } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { InputLabel, IconButtonBackground } from "components";

import { usePermission } from "hooks";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import findIndex from "lodash/findIndex";

const ProductAttributeOptionForm = ({ control, setValue, clearErrors }) => {
  const [inputValue, setInputValue] = useState("");

  const { messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_attribute");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const {
    fieldState: { error },
  } = useController({
    control,
    name: "options",
  });

  useUpdateEffect(() => {
    if (!isEmpty(fields) && error) {
      clearErrors("options");
    }
  }, [fields, error]);

  return (
    <Box
      sx={{
        paddingTop: 3,
        maxWidth: "65%",
      }}
    >
      <InputLabel htmlFor="options" error={!!error}>
        {messages["optional"]}

        <List>
          {fields.map((el, idx) => {
            return (
              <ListItem
                key={el.id}
                sx={{
                  paddingRight: 12,
                }}
                secondaryAction={
                  <Fragment>
                    {!get(el, "is_used") && (
                      <IconButtonBackground
                        sx={{
                          backgroundColor: "transparent",
                          ["& svg"]: {
                            color: "rgba(0, 0, 0, 0.54)",
                          },
                          ["&:hover"]: {},
                        }}
                        onClick={(e) => {
                          remove(idx);
                        }}
                      >
                        <DeleteIcon />
                      </IconButtonBackground>
                    )}
                  </Fragment>
                }
              >
                <ListItemText
                  children={
                    <Input
                      fullWidth
                      defaultValue={el.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue(`options.${idx}.name`, value);
                        setValue(`options.${idx}.value`, value);
                      }}
                      {...(!writePermission && {
                        readOnly: true,
                        disableUnderline: true,
                      })}
                    />
                  }
                />
              </ListItem>
            );
          })}
          <ListItem
            sx={{
              paddingRight: 12,
            }}
          >
            <ListItemText
              children={
                <Input
                  fullWidth
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputValue && inputValue.trim()) {
                      const index = findIndex(fields, {
                        value: inputValue,
                      });

                      if (index === -1) {
                        append({
                          name: inputValue,
                          value: inputValue,
                        });
                      }
                      setInputValue("");
                      e.preventDefault();
                    }
                  }}
                />
              }
            />
          </ListItem>
        </List>
      </InputLabel>

      {error && (
        <FormHelperText
          sx={{
            paddingLeft: "16px",
          }}
          error={!!error}
          children={error.message}
        />
      )}
    </Box>
  );
};

export default ProductAttributeOptionForm;

{
  /* {error && (
        <FormHelperText
          sx={{
            paddingLeft: "16px",
          }}
          error={!!error}
          children={error.message}
        />
      )} */
}

{
  /* <Grid item xs={12}>
  <InputLabel htmlFor="options" sx={{ paddingLeft: 2 }}>
    {messages["optional"]}
  </InputLabel>
  <List>
    {Object.keys(mapOption).map((key, idx) => {
      if (key === "") {
        return null;
      }
      return (
        <ListItem
          key={mapOption[key].id || `new${idx}`}
          sx={{
            width: "70%",
            paddingRight: 12,
          }}
          secondaryAction={
            <Fragment>
              {!get(mapOption[key], "is_used") && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    if (mapOption[key].id) {
                      setDeletionMap(key, mapOption[key]);
                    }
                    removeMap(key);
                  }}
                >
                  <Icon>
                    <MdDelete />
                  </Icon>
                </IconButton>
              )}
            </Fragment>
          }
        >
          <ListItemText
            children={
              <MuiInput
                fullWidth
                value={mapOption[key].name || ""}
                onChange={(e) => {
                  setMap(key, {
                    ...mapOption[key],
                    name: e.target.value,
                    value: e.target.value,
                  });
                }}
                {...(!writePermission && {
                  readOnly: true,
                  disableUnderline: true,
                })}
              />
            }
          />
        </ListItem>
      );
    })}
    {mapOption[""] && (
      <ListItem
        key={mapOption[""]}
        sx={{
          width: "70%",
          paddingRight: 12,
        }}
        secondaryAction={
          <Fragment>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => {
                removeMap("");
              }}
            >
              <Icon>
                <MdDelete />
              </Icon>
            </IconButton>
          </Fragment>
        }
      >
        <ListItemText
          children={
            <MuiInput
              fullWidth
              value={mapOption[""].name}
              onChange={(e) => {
                setMap("", {
                  ...mapOption[""],
                  name: e.target.value,
                  value: e.target.value,
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isEmpty(e.target.value)) {
                  setMap(e.target.value, {
                    id: null,
                    name: e.target.value,
                    value: e.target.value,
                  });

                  setMap("", {
                    id: null,
                    name: "",
                    value: "",
                  });

                  e.preventDefault();
                } else if (e.key === "Enter" && isEmpty(e.target.value)) {
                  e.preventDefault();
                }
              }}
            />
          }
        />
      </ListItem>
    )}
    {writePermission && (
      <Button
        variant="contained"
        onClick={() => {
          if (!isEmpty(mapOption[""])) {
            setMap(mapOption[""].name, mapOption[""]);

            setMap("", {
              id: null,
              name: "",
              value: "",
            });
          } else {
            setMap("", {
              id: null,
              name: "",
              value: "",
            });
          }
        }}
        sx={{
          minWidth: "48px",
          minHeight: "48px",
          backgroundColor: "primary.main",
          padding: 1,
          marginTop: 3,
        }}
      >
        <Icon size="1.5rem" color="#FFF">
          <HiOutlinePlus />
        </Icon>
      </Button>
    )}
  </List>
</Grid>; */
}
