import { CartesianGrid as OriginalCartesianGrid } from "recharts";

const CartesianGrid = (
  props: React.ComponentPropsWithoutRef<typeof OriginalCartesianGrid>
) => {
  return <OriginalCartesianGrid strokeDasharray="4 4" opacity={0.65} {...props} />;
};

export default CartesianGrid;
