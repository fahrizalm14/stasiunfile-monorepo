// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { MemberStatus } from '@utils/type';


export default interface IMembership {
  _id?: string;
  publicAddress: string;
  storage: number;
  expired: number;
  phoneNumber: string;
  nonce: string;
  createdAt?: Date;
  updatedAt?: Date;
  memberStatus?: MemberStatus;
}
