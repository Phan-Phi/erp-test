import React, { Fragment, memo } from "react";

import {
  Path,
  Control,
  UseFormSetError,
  UseFormClearErrors,
  useController,
  useFieldArray,
  ArrayPath,
  FieldArray,
} from "react-hook-form";

import Dropzone, {
  DropzoneOptions,
  DropzoneRootProps,
  FileError,
  ErrorCode,
} from "react-dropzone";

import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import {
  InputProps,
  FormControl,
  FormHelperText,
  FormLabelProps,
  FormControlProps,
  FormHelperTextProps,
  Box,
  Stack,
} from "@mui/material";

import { FormLabel, Image } from "components";

type CommonProps<T extends { [key: string]: any }> = {
  label?: string;
  placeholder?: string;
  InputProps?: InputProps;
  FormLabelProps?: FormLabelProps;
  FormControlProps?: FormControlProps;
  renderDropzone?: (getRootProps: (props?: DropzoneRootProps) => {}) => JSX.Element;
  FormHelperTextProps?: FormHelperTextProps;
  DropzoneOptions?: Omit<DropzoneOptions, "onDrop">;
  DropzoneRootProps?: DropzoneRootProps;
  control: Control<T, any>;
  name: Path<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
};

export type Props<T extends { [key: string]: any }> = CommonProps<T>;

type TValue = { file: File; formId?: string } | { file: string; formId?: string };

export const FormControlForUpload = <T extends { [key: string]: any }>(
  props: Props<T>
) => {
  const {
    name,
    label,
    control,
    setError,
    clearErrors,
    FormLabelProps,
    renderDropzone,
    DropzoneOptions,
    FormControlProps,
    DropzoneRootProps,
    FormHelperTextProps,
  } = props;

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const { fields, remove, append } = useFieldArray({
    control,
    keyName: "formId",
    name: name as ArrayPath<T>,
  });

  if (DropzoneOptions?.multiple) {
    return (
      <FormControl {...FormControlProps} error={!!error}>
        <FormLabel children={label} {...FormLabelProps} />

        <Dropzone
          {...{
            onDrop: (acceptedFiles, rejectedFiles) => {
              if (!isEmpty(rejectedFiles)) {
                let errors: FileError[] = get(rejectedFiles, "[0].errors");

                errors.forEach((error) => {
                  if (error.code === ErrorCode.FileInvalidType) {
                    setError(name, {
                      type: "fileType",
                      message: error.message,
                    });
                  } else if (error.code === ErrorCode.FileTooLarge) {
                    setError(name, {
                      type: "size",
                      message: error.message,
                    });
                  } else if (error.code === ErrorCode.TooManyFiles) {
                    setError(name, {
                      type: "size",
                      message: error.message,
                    });
                  }
                });

                return;
              }

              clearErrors(name);

              acceptedFiles.forEach((el) => {
                append({
                  file: el,
                } as FieldArray<T, ArrayPath<T>>);
              });
            },

            accept: {
              "image/*": [],
            },
            ...DropzoneOptions,
          }}
        >
          {({ getRootProps }) => {
            let renderImage: React.ReactNode = null;

            if (Array.isArray(fields) && !isEmpty(fields)) {
              const _fields = fields as TValue[];

              renderImage = (
                <Fragment>
                  {_fields.map((el, idx) => {
                    if (el.file instanceof File) {
                      const blob = URL.createObjectURL(el.file);

                      return (
                        <Avatar
                          key={el.formId}
                          value={blob}
                          onChange={() => {
                            URL.revokeObjectURL(blob);
                            remove(idx);
                          }}
                        />
                      );
                    }

                    return (
                      <Avatar
                        value={el.file}
                        key={el.formId}
                        onChange={() => {
                          remove(idx);
                        }}
                      />
                    );
                  })}
                </Fragment>
              );
            }

            return (
              <Stack flexDirection="row" columnGap={2} flexWrap="wrap">
                {renderImage}
                {renderDropzone ? (
                  renderDropzone(getRootProps)
                ) : (
                  <Box
                    {...getRootProps(DropzoneRootProps)}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginY: "0.5rem",
                      cursor: "pointer",
                      color: "black",
                      borderRadius: "10px",
                      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
                      width: "100px",
                      height: "100px",
                      backgroundColor: "#E6E6E6",
                      transition: "all 0.4s",
                      ["&:hover"]: {
                        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.25)",
                      },
                    }}
                  >
                    <FileUploadOutlinedIcon />
                  </Box>
                )}
              </Stack>
            );
          }}
        </Dropzone>

        <FormHelperText
          {...FormHelperTextProps}
          children={error?.message || FormHelperTextProps?.children}
        />
      </FormControl>
    );
  } else {
    return (
      <FormControl {...FormControlProps} error={!!error}>
        <FormLabel children={label} {...FormLabelProps} />

        <Dropzone
          {...{
            onDrop: (acceptedFiles, rejectedFiles) => {
              if (!isEmpty(rejectedFiles)) {
                let errors: FileError[] = get(rejectedFiles, "[0].errors");

                errors.forEach((error) => {
                  if (error.code === ErrorCode.FileInvalidType) {
                    setError(name as Path<T>, {
                      type: "fileType",
                      message: error.message,
                    });
                  } else if (error.code === ErrorCode.FileTooLarge) {
                    setError(name as Path<T>, {
                      type: "size",
                      message: error.message,
                    });
                  } else {
                  }
                });

                return;
              }

              clearErrors(name);

              const transformedAcceptedFiles = acceptedFiles.map((el) => {
                return {
                  file: el,
                };
              });

              onChange(transformedAcceptedFiles);
            },
            onFileDialogCancel() {
              onChange([]);
            },
            accept: {
              "image/*": [],
            },
            multiple: false,
            maxFiles: 1,
            ...DropzoneOptions,
          }}
        >
          {({ getRootProps }) => {
            if (Array.isArray(value) && !isEmpty(value)) {
              const _value = value as TValue[];

              return (
                <Stack flexDirection="row">
                  {_value.map((el, idx) => {
                    if (el.file instanceof File) {
                      const blob = URL.createObjectURL(el.file);

                      return (
                        <Avatar
                          value={blob}
                          key={idx}
                          onChange={() => {
                            URL.revokeObjectURL(blob);
                            onChange([]);
                          }}
                        />
                      );
                    }

                    return (
                      <Avatar
                        value={el.file}
                        key={idx}
                        onChange={() => {
                          onChange([]);
                        }}
                      />
                    );
                  })}
                </Stack>
              );
            }

            return renderDropzone ? (
              renderDropzone(getRootProps)
            ) : (
              <Box
                {...getRootProps(DropzoneRootProps)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginY: "0.5rem",
                  cursor: "pointer",
                  color: "black",
                  borderRadius: "10px",
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#E6E6E6",
                  transition: "all 0.4s",
                  ["&:hover"]: {
                    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.25)",
                  },
                }}
              >
                <FileUploadOutlinedIcon />
              </Box>
            );
          }}
        </Dropzone>

        <FormHelperText
          {...FormHelperTextProps}
          children={error?.message || FormHelperTextProps?.children}
        />
      </FormControl>
    );
  }
};

const Avatar = memo(
  ({
    value,
    onChange,
  }: React.PropsWithChildren<{ value: string; onChange: (...event: any[]) => void }>) => {
    return (
      <Box
        sx={{
          position: "relative",
          width: "100px",
          height: "100px",
          marginY: "0.5rem",

          "& img": {
            borderRadius: "10px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
            transition: "all 0.4s",
            height: "100px",
            objectFit: "cover",
            ["&:hover"]: {
              boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.25)",
            },
          },
        }}
      >
        <Image width={100} height={100} src={value} objectFit="contain" />
        <CloseIcon
          onClick={() => {
            onChange();
          }}
          sx={{
            cursor: "pointer",
            fontSize: "1.2rem",
            borderRadius: "50%",
            color: "white",
            position: "absolute",
            right: "-7px",
            top: "-7px",
            backgroundColor: "red",
          }}
        />
      </Box>
    );
  }
);
