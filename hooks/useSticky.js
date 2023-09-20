import { useState, useEffect, useContext } from "react";
import { LayoutContext } from "contexts";
import { useWindowSize } from "react-use";

const useSticky = () => {
  const layoutContext = useContext(LayoutContext);

  const { height } = useWindowSize();
  const [offsetTop, setOffsetTop] = useState(0);
  const [tableHeight, setTableHeight] = useState(300);

  useEffect(() => {
    const { extraHeight, topbarHeight, navbarHeight } = layoutContext.state;

    if (extraHeight && topbarHeight && navbarHeight) {
      setOffsetTop(extraHeight + topbarHeight + navbarHeight);
    }
  }, [layoutContext]);

  useEffect(() => {
    let extraPadding = 300;

    if (!offsetTop) {
      return;
    }

    setTableHeight(height - extraPadding - offsetTop);
  }, [height, offsetTop]);

  return {
    height: tableHeight,
    offsetTop,
  };
};

export default useSticky;
