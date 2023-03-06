// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { IPaymentDetails } from '@interfaces/IPaymentGateway';
import ITransaction, { IResTxByMembershipId } from '@interfaces/ITransaction';
import { BankName, PaymentType } from '@utils/type';

export interface ICreatPayment {
  packageId: string;
  paymentMethod: BankName | PaymentType;
  membershipId: string;
  phoneNumber: string;
}

export default interface ITransactionService {
  save(payload: ICreatPayment): Promise<ITransaction>;
  notification<T>(data: T): Promise<IPaymentDetails>;
  getByTxId(txId: string): Promise<ITransaction>;
  getByMembershipId(membershipId: string): Promise<IResTxByMembershipId[]>;
}
