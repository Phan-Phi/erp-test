import { TableCell as MuiTableCell, TableCellProps, styled } from "@mui/material";

const selectedKeyList = ["maxWidth"] as const;

type SelectedKeyListType = (typeof selectedKeyList)[number];

type SelectedType = Pick<React.CSSProperties, SelectedKeyListType>;

type ExtendedTableCellProps = TableCellProps & SelectedType;

const TableCell = (props: ExtendedTableCellProps) => {
  return <StyledTableCell {...props} />;
};

const StyledTableCell = styled(MuiTableCell, {
  shouldForwardProp: (propName) => !selectedKeyList.includes(propName as any),
})<SelectedType>(({ maxWidth, width }) => {
  return {
    maxWidth,
    width,
  };
});

export default TableCell;
