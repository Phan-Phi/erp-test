import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FileInput from "./FileInput";

const Form = () => {
  const methods = useForm({
    mode: "onBlur",
  });
  const onSubmit = methods.handleSubmit((values) => {});

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <div className="">
          <FileInput
            accept="image/png, image/jpg, image/jpeg, image/gif"
            name="file alt text"
            label="File Upload"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default Form;
