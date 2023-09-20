import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export interface PartnerSchemaProps {
  max_debt: string;
  name: string;
  tax_identification_number: string;
  id?: number;
  total_debt_amount?: string;
  email: string;
  notes: string;
  contact_info: string;
}

export const partnerSchema = () => {
  return yupResolver(
    object().shape({
      max_debt: string(),
      name: string().required(),
      email: string().email(),
      tax_identification_number: string().max(20),
      notes: string(),
      contact_info: string(),
    })
  );
};

export const defaultPartnerFormState = (): PartnerSchemaProps => {
  return {
    max_debt: "0",
    name: "",
    tax_identification_number: "",
    contact_info: "",
    email: "",
    notes: "",
  };
};
