// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IPackage from '@interfaces/IPackage';
import { IPaymentDetails } from '@interfaces/IPaymentGateway';
import ITransaction from '@interfaces/ITransaction';
import { TransactionStatus } from '@utils/type';

export default class OTransaction implements ITransaction {
  _id?: string;
  membershipId: string;
  phoneNumber: string;
  packages: IPackage;
  details?: IPaymentDetails;
  createdAt: Date;
  status: TransactionStatus;
  paidAt?: Date;
  constructor(params: {
    _id?: string;
    membershipId: string;
    phoneNumber: string;
    packages: IPackage;
    details?: IPaymentDetails;
    createdAt: Date;
    status: TransactionStatus;
    paidAt?: Date;
  }) {
    this._id = params._id;
    this.membershipId = params.membershipId;
    this.phoneNumber = params.phoneNumber;
    this.packages = params.packages;
    this.details = params.details;
    this.createdAt = params && params.createdAt ? params.createdAt : new Date();
    this.status =
      params && params.status ? params.status : TransactionStatus.PENDING;
  }
}
