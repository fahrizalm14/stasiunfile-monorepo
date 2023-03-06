// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IPackage from '@interfaces/IPackage';
import { PackageStatus } from '@utils/type';

export interface ISavePackage {
  _id?: string;
  name: string;
  price: number;
  storage: number;
  expired: number;
  status: PackageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export default interface IPackageModel {
  save(newPackage: ISavePackage): Promise<IPackage>;
  getAll(): Promise<IPackage[]>;
  getById(_id: string): Promise<IPackage | null>;
  delete(_id: string): Promise<boolean>;
  updateById(_id: string, newData: object): Promise<IPackage | null>;
}
