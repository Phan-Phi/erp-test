import { ResponsiveContainer as OriginalResponsiveContainer } from "recharts";

const ResponsiveContainer = (
  props: React.ComponentPropsWithoutRef<typeof OriginalResponsiveContainer>
) => {
  return <OriginalResponsiveContainer height={400} {...props} />;
};

export default ResponsiveContainer;
