// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IPackage from '@interfaces/IPackage';
import { PackageStatus } from '@utils/type';


export default class OPacakage implements IPackage {
  _id?: string;
  name: string;
  price: number;
  storage: number;
  expired: number;
  status?: PackageStatus;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(params: {
    _id?: string;
    name: string;
    price: number;
    storage: number;
    expired: number;
    status?: PackageStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = params._id;
    this.name = params.name;
    this.price = params.price;
    this.storage = params.storage;
    this.expired = params.expired;
    this.status =
      params && params.status ? params.status : PackageStatus.NOT_ACTIVE;
    this.createdAt = params && params.createdAt ? params.createdAt : new Date();
    this.updatedAt = params && params.updatedAt ? params.updatedAt : new Date();
  }
}
