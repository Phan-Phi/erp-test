import { useState, useCallback } from "react";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider() {
  const [value, setValue] = useState([20, 37]);

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  });

  return (
    <Slider
      getAriaLabel={() => "Temperature range"}
      value={value}
      onChange={handleChange}
      valueLabelDisplay="auto"
      getAriaValueText={valuetext}
    />
  );
}
