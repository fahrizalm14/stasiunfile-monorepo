// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IMembership from '@interfaces/IMembership';
import { MemberStatus } from '@utils/type';

export default class OMembership implements IMembership {
  _id?: string;
  publicAddress: string;
  storage: number;
  expired: number;
  phoneNumber: string;
  nonce: string;
  createdAt?: Date;
  updatedAt?: Date = new Date();
  memberStatus?: MemberStatus = MemberStatus.NotActive;
  constructor(params: {
    _id?: string;
    publicAddress: string;
    storage: number;
    expired: number;
    phoneNumber: string;
    nonce: string;
    createdAt?: Date;
    updatedAt?: Date;
    memberStatus?: MemberStatus;
  }) {
    this._id = params._id;
    this.publicAddress = params.publicAddress;
    this.storage = params.storage;
    this.expired = params.expired;
    this.phoneNumber = params.phoneNumber;
    this.nonce = params.nonce;
    this.createdAt = params && params.createdAt ? params.createdAt : new Date();
    this.updatedAt = params && params.updatedAt ? params.updatedAt : new Date();
    this.memberStatus =
      params && params.memberStatus
        ? params.memberStatus
        : MemberStatus.NotActive;
  }
}
