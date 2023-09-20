import { string, object, mixed } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { validatePhoneNumber } from "./utils";
import { getChoiceValue } from "../libs";

import {
  ChoiceType,
  ORDER_PURCHASE_CHANNEL_ITEM,
  ORDER_SHIPPING_METHOD_ITEM,
} from "interfaces";

export interface OrderSchemaProps {
  id?: number;
  receiver: {
    [key: string]: any;
  } | null;
  receiver_name: string;
  receiver_email: string;
  receiver_phone_number: string;
  status: string;
  customer_notes: string;
  channel: ORDER_PURCHASE_CHANNEL_ITEM | null;
  shipping_method: ORDER_SHIPPING_METHOD_ITEM | null;
}

export const orderSchema = (choice?: ChoiceType) => {
  if (choice === undefined) {
    return yupResolver(
      object().shape({
        receiver: mixed(),
        receiver_name: string().nullable(),
        receiver_email: string().nullable().email(),
        receiver_phone_number: string().nullable(),
        status: string().required(),
        customer_notes: string().nullable(),
        channel: mixed().required(),
        shipping_method: mixed().required(),
      })
    );
  }

  const { order_statuses } = choice;

  return yupResolver(
    object().shape({
      receiver: mixed(),
      receiver_name: string().nullable(),
      receiver_email: string().nullable().email(),
      receiver_phone_number: validatePhoneNumber().nullable(),
      status: string().oneOf(getChoiceValue(order_statuses)),
      customer_notes: string().nullable(),
      channel: mixed().required(),
      shipping_method: mixed().required(),
    })
  );
};

export const defaultOrderFormState = (choice?: ChoiceType): OrderSchemaProps => {
  if (choice === undefined) {
    return {
      receiver: null,
      receiver_name: "",
      receiver_email: "",
      receiver_phone_number: "",
      status: "",
      customer_notes: "",
      channel: null,
      shipping_method: null,
    };
  }

  const { order_statuses } = choice;

  return {
    receiver: null,
    receiver_name: "",
    receiver_email: "",
    receiver_phone_number: "",
    status: getChoiceValue(order_statuses)[0],
    customer_notes: "",
    channel: null,
    shipping_method: null,
  };
};
