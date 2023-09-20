import { useMutation } from "hooks";
import { useWindowSize } from "react-use";
import React, { createContext, useEffect } from "react";

interface IState {
  topbarHeight: number;
  navbarHeight: number;
  extraHeight: number;
  sumHeight: number;
  windowHeight: number;
  windowWidth: number;
}

export interface ILayout {
  state: IState;
  setState: (obj: object) => void;
}

export const LayoutContext = createContext<ILayout>({
  state: {
    navbarHeight: 0,
    topbarHeight: 0,
    extraHeight: 24,
    sumHeight: 0,
    windowHeight: 0,
    windowWidth: 0,
  },
  setState: () => {},
});

const Layout = (props: React.PropsWithChildren<{}>) => {
  const { children } = props;
  const { width, height } = useWindowSize();

  const { state, set: setState } = useMutation({
    navbarHeight: 0,
    topbarHeight: 0,
    extraHeight: 24,
    sumHeight: 0,
    windowHeight: 0,
    windowWidth: 0,
  });

  useEffect(() => {
    setState({
      windowHeight: height,
      windowWidth: width,
    });
  }, [width, height]);

  useEffect(() => {
    setState({
      sumHeight: state.extraHeight + state.navbarHeight + state.topbarHeight,
    });
  }, [state.extraHeight, state.navbarHeight, state.topbarHeight]);

  return (
    <LayoutContext.Provider value={{ state, setState }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default Layout;
