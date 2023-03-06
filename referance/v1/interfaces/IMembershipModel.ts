// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IMembership from '@interfaces/IMembership';
import { MemberStatus } from '@utils/type';

export interface IMembershipSave {
  _id?: string;
  publicAddress: string;
  storage: number;
  expired: number;
  phoneNumber: string;
  nonce: string;
  createdAt: Date;
  updatedAt: Date;
  memberStatus: MemberStatus;
}

export default interface IMembershipModel {
  save(newMember: IMembershipSave): Promise<IMembership>;
  findOne(queryObject: object): Promise<IMembership | null>;
  // findAll(queryObject: object): Promise<IMembership[]>;
  // getAll(): Promise<IMembership[]>;
  getById(_id: string): Promise<IMembership | null>;
  updateById(_id: string, newData: object): Promise<IMembership | null>;
}
