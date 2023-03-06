// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ICompany, { ICompanyService } from '@interfaces/ICompany';
import { isValidObjectId, Model, model, Schema } from 'mongoose';

import InvariantError from '../error/InvariantError';

export const companySchema: Schema<ICompany> = new Schema({
  website: String
});

export const companyDatabase: Model<ICompany> = model('company', companySchema);

export default class CompanyService implements ICompanyService {
  public async get(): Promise<ICompany> {
    try {
      const check = await companyDatabase.find();
      if (!check.length) {
        const company = new companyDatabase({
          website: ''
        });
        return await company.save();
      }
      return check[0];
    } catch (error) {
      throw new InvariantError('Company not found');
    }
  }

  public async update(_id: string, data: ICompany): Promise<ICompany> {
    if (!isValidObjectId(_id)) {
      throw new InvariantError('Invalid id');
    }
    if (
      !data.website ||
      data.website === '' ||
      typeof data.website !== 'string'
    ) {
      throw new InvariantError('Invalid data');
    }
    const query = await companyDatabase.findByIdAndUpdate(_id, data, {
      new: true
    });
    if (!query) {
      throw new InvariantError('Company not found');
    }

    return query;
  }
}
