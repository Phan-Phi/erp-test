import { string, object, mixed, boolean } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getChoiceValue } from "../libs";

import { transformNumberNotEmpty } from "./utils";

import { ChoiceType, CASH_PAYMENT_METHOD_ITEM } from "interfaces";

export interface TransactionSchemaProps {
  status: string;
  source_type: string;
  target_type: string;
  flow_type: string;
  notes: string;
  address: string;
  amount: string;
  source_id: object | null;
  target_id: object | null;
  target_name: string;
  affect_creditor: boolean;
  type: object | null;
  payment_method: CASH_PAYMENT_METHOD_ITEM | null;
}

export const transactionSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        status: mixed(),
        type: object().required().nullable(),
        source_type: mixed(),
        flow_type: mixed(),
        notes: string().trim(),
        amount: string(),
        source_id: mixed(),
        affect_creditor: boolean(),
        target_type: mixed(),
        target_id: mixed(),
        target_name: string(),
        payment_method: mixed(),
        address: string().nullable(),
      })
    );
  }

  const {
    transaction_statuses,
    transaction_source_types,
    transaction_flow_types,
    transaction_target_types,
  } = choice;

  let transactionTargetTypeValueList = getChoiceValue(transaction_target_types);

  transactionTargetTypeValueList = ["", ...transactionTargetTypeValueList];

  return yupResolver(
    object().shape({
      status: string().oneOf(getChoiceValue(transaction_statuses)),
      type: mixed().required(),
      source_type: string().oneOf(["", ...getChoiceValue(transaction_source_types)]),
      flow_type: string().oneOf(getChoiceValue(transaction_flow_types)),
      notes: string(),
      amount: transformNumberNotEmpty().required(),
      source_id: mixed(),
      affect_creditor: boolean(),
      target_type: string().oneOf(transactionTargetTypeValueList),
      target_id: mixed(),
      target_name: string(),
      payment_method: mixed(),
      address: string(),
    })
  );
};

export const defaultTransactionFormState = (
  choice?: ChoiceType
): TransactionSchemaProps => {
  if (choice === undefined) {
    return {
      status: "",
      source_type: "",
      target_type: "",
      flow_type: "",
      notes: "",
      address: "",
      amount: "0",
      source_id: null,
      target_id: null,
      target_name: "",
      affect_creditor: true,
      type: null,
      payment_method: null,
    };
  }

  const { transaction_statuses, transaction_flow_types } = choice;

  return {
    status: getChoiceValue(transaction_statuses)[0],
    source_type: "",
    target_type: "",
    flow_type: getChoiceValue(transaction_flow_types)[0],
    notes: "",
    address: "",
    amount: "0",
    source_id: null,
    target_id: null,
    target_name: "",
    affect_creditor: true,
    type: null,
    payment_method: null,
  };
};
