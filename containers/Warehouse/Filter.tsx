import { Stack } from "@mui/material";
import { SearchField } from "components";

type FilterProps = {
  onFilterHandler: (key: any) => (value: any) => void;
  data?: Record<string, string>;
};

const Filter = ({ onFilterHandler: onFilterHandler, data }: FilterProps) => {
  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={data?.search}
        onChange={onFilterHandler("search")}
      />
    </Stack>
  );
};

export default Filter;
