// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IPackage from '@interfaces/IPackage';
import {
  IPaymentDetails,
  IVirtualAccountDetail
} from '@interfaces/IPaymentGateway';
import { TransactionStatus } from '@utils/type';

export default interface ITransaction {
  _id?: string;
  membershipId: string;
  phoneNumber: string;
  packages: IPackage;
  details?: IVirtualAccountDetail;
  createdAt: Date;
  status: TransactionStatus;
  paidAt?: Date;
}

export interface IResTxByMembershipId {
  _id?: string;
  packageName: string;
  orderId?: string;
  virtualAccount?: string;
  totalAmount: string;
  storage: string;
  expired: number;
  status: string;
  createdAt: Date;
  paidAt?: Date;
}
