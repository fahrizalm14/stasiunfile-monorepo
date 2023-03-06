// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { PackageStatus } from '@utils/type';

export default interface IPackage {
  _id?: string;
  name: string;
  price: number;
  storage: number;
  expired: number;
  status?: PackageStatus;
  createdAt?: Date;
  updatedAt?: Date;
  storageString?: string;
  expiredMonth?: number;
}
