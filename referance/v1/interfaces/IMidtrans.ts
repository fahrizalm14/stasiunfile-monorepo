// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { BankName, PaymentType } from '@utils/type';

export interface IItemMidtrans {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
export interface ITransactionDetailMidtrans {
  order_id: string;
  gross_amount: number;
}
export interface ICostumerDetailMidtrans {
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  billing_address?: {
    address: string;
    city: string;
    postal_code: string;
  };
}

export interface IPaymentType {
  payment_type: PaymentType;
  transaction_details: ITransactionDetailMidtrans;
  item_details: IItemMidtrans[];
  customer_details: ICostumerDetailMidtrans;
}

export interface IGopayPayment extends IPaymentType {
  payment_type: PaymentType.GOPAY;
  gopay: {
    enable_callback: boolean;
    callback_url: string;
  };
}

export interface IQrisPayment extends IPaymentType {
  payment_type: PaymentType.QRIS;
  qris: {
    acquirer: "gopay";
  };
}

export interface IBniVA extends IPaymentType {
  payment_type: PaymentType.BANK_TRANSFER;
  bank_transfer: { bank: BankName.BNI };
}

export interface IPermataVA extends IPaymentType {
  payment_type: PaymentType.BANK_TRANSFER;
  bank_transfer: { bank: BankName.PERMATA };
}
