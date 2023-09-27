import dynamic from "next/dynamic";
import { UseControllerReturn } from "react-hook-form";
import { FormControl, FormHelperText } from "@mui/material";

import { FormLabel } from "components";
import { FormControlBaseProps } from "./FormControlBase";

const Editor = dynamic(() => import("../../components/Editor/Editor"), {
  ssr: false,
});

type FormControlForRichTextProps = {
  value?: string;
  label?: string;
  EditorProps?: React.ComponentProps<typeof Editor>;
  controlState: any;
  height?: number;
} & FormControlBaseProps;

const FormControlForRichText = (props: FormControlForRichTextProps) => {
  const {
    label,
    FormLabelProps,
    FormControlProps,
    FormHelperTextProps,
    EditorProps,
    height = 500,
    controlState,
  } = props;

  const { field, fieldState } = controlState as UseControllerReturn;

  const { name, onBlur, onChange, value } = field;
  const { error } = fieldState;

  return (
    <FormControl error={!!error} {...FormControlProps}>
      <FormLabel {...FormLabelProps} htmlFor={name}>
        {label}
      </FormLabel>
      <Editor
        height={height}
        {...EditorProps}
        onEditorChange={(content) => onChange(content)}
        value={value}
        onBlur={onBlur}
      />
      <FormHelperText children={error && error.message} {...FormHelperTextProps} />
    </FormControl>
  );
};

export default FormControlForRichText;
