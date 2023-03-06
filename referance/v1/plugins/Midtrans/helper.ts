// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  IBniVA,
  ICostumerDetailMidtrans,
  IGopayPayment,
  IItemMidtrans,
  IPermataVA,
  IQrisPayment,
  ITransactionDetailMidtrans,
} from '@interfaces/IMidtrans';
import { BankName, PaymentType } from '@utils/type';

export default class MidtransHelper {
  public payment_type: PaymentType = PaymentType.EMPTY_STRING;
  public item_details: IItemMidtrans[];
  public transaction_details: ITransactionDetailMidtrans;
  public customer_details: ICostumerDetailMidtrans;
  constructor(
    transaction_details: ITransactionDetailMidtrans,
    item_details: IItemMidtrans[],
    customer_details: ICostumerDetailMidtrans
  ) {
    this.transaction_details = transaction_details;
    this.item_details = item_details;
    this.customer_details = customer_details;
  }

  public async bniVirtualAccount(): Promise<IBniVA> {
    return {
      payment_type: PaymentType.BANK_TRANSFER,
      bank_transfer: { bank: BankName.BNI },
      customer_details: this.customer_details,
      item_details: this.item_details,
      transaction_details: this.transaction_details,
    };
  }

  public async permataVirtualAccount(): Promise<IPermataVA> {
    return {
      payment_type: PaymentType.BANK_TRANSFER,
      bank_transfer: { bank: BankName.PERMATA },
      customer_details: this.customer_details,
      item_details: this.item_details,
      transaction_details: this.transaction_details,
    };
  }

  public async gopayApp(): Promise<IGopayPayment> {
    return {
      payment_type: PaymentType.GOPAY,
      gopay: {
        enable_callback: true,
        callback_url: "someapps://callback",
      },
      customer_details: this.customer_details,
      item_details: this.item_details,
      transaction_details: this.transaction_details,
    };
  }

  public async qrisScan(): Promise<IQrisPayment> {
    return {
      payment_type: PaymentType.QRIS,
      qris: {
        acquirer: "gopay",
      },
      customer_details: this.customer_details,
      item_details: this.item_details,
      transaction_details: this.transaction_details,
    };
  }
}
