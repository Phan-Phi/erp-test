import { useWindowSize } from "react-use";
import { useEffect, useRef, useState } from "react";

const useGetHeightForTable = () => {
  const ref = useRef<HTMLElement>();

  const [height, setHeight] = useState(0);

  const { height: windowHeight } = useWindowSize();

  useEffect(() => {
    const element = ref.current;

    if (element) {
      const { offsetTop } = element;
      const paginationHeight = 50;

      setHeight(windowHeight - offsetTop - paginationHeight);
    }
  }, [windowHeight]);

  return [ref, { height }] as const;
};

export default useGetHeightForTable;
