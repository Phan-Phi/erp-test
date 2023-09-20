import { get, isEmpty } from "lodash";
import { ErrorCode, FileError, FileRejection } from "react-dropzone";
import { Path, UseFormSetError } from "react-hook-form";

export const dropzoneRejected = <T>(
  rejectedFiles: FileRejection[],
  name: any,
  setError: UseFormSetError<any>
) => {
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

    return true;
  }

  return false;
};
