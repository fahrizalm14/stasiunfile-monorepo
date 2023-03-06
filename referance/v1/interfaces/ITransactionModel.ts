// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IPackage from '@interfaces/IPackage';
import { IPaymentDetails } from '@interfaces/IPaymentGateway';
import ITransaction from '@interfaces/ITransaction';
import { TransactionStatus } from '@utils/type';

export interface ISaveTransaction {
  membershipId: string;
  phoneNumber: string;
  packages: IPackage;
  details: IPaymentDetails;
  status: TransactionStatus;
  createdAt: Date;
}
export default interface ITransactionModel {
  save(data: ISaveTransaction): Promise<ITransaction>;
  getById(_id: string): Promise<ITransaction | null>;
  getUnpaid(): Promise<ITransaction[]>;
  getPaid(): Promise<ITransaction[]>;
  getAll(): Promise<ITransaction[]>;
  pay(_id: string): Promise<ITransaction | null>;
  unpay(_id: string): Promise<ITransaction | null>;
  delete(_id: string): Promise<boolean>;
  payWithTxId(txId: string): Promise<ITransaction | null>;
  failureWithTxId(txId: string): Promise<ITransaction | null>;
  pendingWithTxId(txId: string): Promise<ITransaction | null>;
  findByTxId(txId: string): Promise<ITransaction | null>;
  findByMembershipId(membershipId: string): Promise<ITransaction[]>;
}
