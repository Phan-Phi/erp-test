import { get } from "lodash";

const getSeoObject = (props: any) => {
  const logo = get(props, "logo");
  const company_name = get(props, "company_name");

  return {
    logo,
    company_name,
  };
};

export { getSeoObject };
