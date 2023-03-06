// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IPackage from '@interfaces/IPackage';
import IPackageModel, { ISavePackage } from '@interfaces/IPackageModel';

import { packagesDatabase } from './database';

export default class PackageModel implements IPackageModel {
  public async save(newPackage: ISavePackage): Promise<IPackage> {
    const query = new packagesDatabase(newPackage);

    return await query.save();
  }
  public async getAll(): Promise<IPackage[]> {
    const query = await packagesDatabase.find().lean();

    return query;
  }
  public async getById(_id: string): Promise<IPackage | null> {
    const query = await packagesDatabase.findById(_id).lean();

    return query;
  }
  public async delete(_id: string): Promise<boolean> {
    const query = await packagesDatabase.findByIdAndDelete(_id);
    if (!query) return false;

    return true;
  }

  public async updateById(
    _id: string,
    newData: object
  ): Promise<IPackage | null> {
    const query = await packagesDatabase.findByIdAndUpdate(
      _id,
      {
        $set: newData
      },
      { new: true }
    );

    return query;
  }
}
