import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

const FileInput = (props) => {
  const { name, label = name } = props;
  const { register, unregister, setValue, watch } = useFormContext();
  const files = watch(name);

  const onDrop = useCallback(
    (droppedFiles) => {
      setValue(name, droppedFiles, { shouldValidate: true });
    },
    [setValue, name]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: props.accept,
  });
  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);

  return (
    <>
      <label htmlFor={name}>{label}</label>
      <div {...getRootProps()} type="file" role="button" aria-label="File Upload" id={name}>
        <input {...props} {...getInputProps()} />
        <div
          style={{ width: "500px", border: "black solid 2px" }}
          className={" " + (isDragActive ? " " : " ")}
        >
          <p className=" ">Drop the files here ...</p>

          {!!files?.length && (
            <div className=" ">
              {files.map((file) => {
                return (
                  <div key={file.name}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        height: "200px",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileInput;
