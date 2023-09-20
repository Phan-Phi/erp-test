import React from "react";

import { Card, CardHeader, CardContent } from "@mui/material";

import { SearchField } from "components";

interface SearchBoxProps {
  value?: string;
  onChange: (value: string) => void;
}

export const SearchBox = (props: SearchBoxProps) => {
  const { value, onChange } = props;

  return (
    <Card>
      <CardHeader title={"Tìm kiếm"} />
      <CardContent
        sx={{
          paddingTop: "0 !important",
        }}
      >
        <SearchField
          initSearch={value}
          onChange={(value) => {
            if (value != undefined) {
              onChange(value);
            }
          }}
          isShowIcon={false}
        />
      </CardContent>
    </Card>
  );
};
