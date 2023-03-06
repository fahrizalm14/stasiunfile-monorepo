// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IMembership from '@interfaces/IMembership';
import IMembershipModel, {
  IMembershipSave
} from '@interfaces/IMembershipModel';

import { membershipsDatabse } from './database';

export default class MembershipModel implements IMembershipModel {
  public async getAll(): Promise<IMembership[]> {
    const query: IMembership[] = await membershipsDatabse.find().lean();

    return query;
  }
  public async getById(_id: string): Promise<IMembership | null> {
    const query = await membershipsDatabse.findById(_id);

    return query;
  }
  public async save(newMember: IMembershipSave): Promise<IMembership> {
    const newMembership = new membershipsDatabse(newMember);
    return await newMembership.save();
  }

  public async findOne(queryObject: object): Promise<IMembership | null> {
    const query = await membershipsDatabse.findOne(queryObject);

    return query;
  }

  public async findAll(queryObject: object): Promise<IMembership[]> {
    const query: IMembership[] = await membershipsDatabse
      .find(queryObject)
      .lean();

    return query;
  }

  public async updateById(
    _id: string,
    newData: object
  ): Promise<IMembership | null> {
    console.log(_id);
    const query = await membershipsDatabse
      .findByIdAndUpdate(
        _id,
        {
          $set: newData
        },
        { new: true }
      )
      .lean();

    return query;
  }
}
