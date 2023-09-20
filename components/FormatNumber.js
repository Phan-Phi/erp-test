import NumberFormat from "react-number-format";

const FormatNumber = ({ children, suffix = " ₫", ...props }) => {
  return (
    <NumberFormat
      {...{
        value: Number(children),
        displayType: "text",
        type: "text",
        thousandSeparator: true,
        isNumericString: true,
        suffix,
        ...props,
      }}
    />
  );
};

export default FormatNumber;
