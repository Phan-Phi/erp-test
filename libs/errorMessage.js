import get from "lodash/get";

const errorMessage = {
  required: "Trường này không được bỏ trống",
  email: "Vui lòng nhập đúng định dạng email",
  fileType: "Vui lòng chọn đúng định dạng file",
  size: "Dung lượng file  quá lớn",
  existEmail: "Email này đã tồn tại",
  existTax: "Mã số thuế này đã tồn tại",
  existMainPhoneNumber: "Số điện thoại này đã tồn tại",
  existUsername: "Username này đã tồn tại",
  positive: "% thuế không được âm",
  oneOf: "Trường này không được bỏ trống",
};

export const errorHandler = (message) => {
  return {
    status: "error",
    statusCode: 400,
    message,
  };
};

export const catchErrorHandler = (error) => {
  if (error.response) {
    console.log("error.response.data", error.response.data);
    console.log("error.response.status", error.response.status);
    console.log("error.response.headers", error.response.headers);
  } else if (error.request) {
    console.log("error.request", error.request);
  } else {
    console.log("Error", error.message);
  }

  console.log("error.config", error.config);

  // console.log(get(error, "response.data"));

  // const sourceData = get(error, "response.data");

  // const dest = fs.createWriteStream("error.txt");

  // dest.write(sourceData);
  // dest.end();

  // source.pipe(dest);

  // console.log({
  //   status: "error",
  //   statusCode: get(error, "response.status"),
  //   message: get(error, "response.data") || "Bad Request",
  // });

  return {
    status: "error",
    statusCode: get(error, "response.status"),
    message: get(error, "response.data") || "Bad Request",
  };
};

export default errorMessage;
