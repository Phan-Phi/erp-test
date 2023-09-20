import { get } from "lodash";

const getSeoObject = (props: any) => {
  const logo = get(props, "logo");

  return {
    logo,
  };
};

export { getSeoObject };
