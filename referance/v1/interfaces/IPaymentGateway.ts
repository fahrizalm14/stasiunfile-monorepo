// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IMembership from '@interfaces/IMembership';
import IPackage from '@interfaces/IPackage';
import { BankName, PaymentType, TransactionStatus } from '@utils/type';

export interface IPaymentDetails {
  transaction_id: string;
  order_id: string;
  payment_type: string;
  gross_amount: string;
  transaction_time: string;
  transaction_status?: TransactionStatus;
}

export interface IGopayDetail extends IPaymentDetails {
  gopayDeeplink: string;
}

export interface IQrisDetail extends IPaymentDetails {
  generateQris: string;
  qrString: string;
}

export interface IVirtualAccountDetail extends IPaymentDetails {
  virtualAccount: string;
  bank: BankName;
}

export default interface IPaymentGateway {
  charge(
    packages: IPackage,
    paymentMethod: PaymentType | BankName,
    membership: IMembership
  ): Promise<IGopayDetail | IQrisDetail | IVirtualAccountDetail>;
  notification<T>(data: T): Promise<IPaymentDetails>;
  status<T>(data: T): Promise<IPaymentDetails>;
}
