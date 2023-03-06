/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
import IContent, { ILogFile, IShared } from '@interfaces/IContent';
import IContentModel from '@interfaces/IContetnModel';

import { contentsDatabase } from './database';

// https://opensource.org/licenses/MIT
export default class ContentModel implements IContentModel {
  public async insertMany(contents: IContent[]): Promise<IContent[]> {
    return await contentsDatabase.insertMany(contents);
  }
  public async save(newContent: IContent): Promise<IContent> {
    return await new contentsDatabase(newContent).save();
  }
  public async find(queryFilter: object): Promise<IContent[]> {
    return await contentsDatabase.find(queryFilter).lean();
  }

  public async getAll(): Promise<IContent[]> {
    return await contentsDatabase.find().lean();
  }

  public async getById(_id: string): Promise<IContent | null> {
    return await contentsDatabase.findById(_id).lean();
  }

  public async delete(_id: string): Promise<IContent | null> {
    return await contentsDatabase.findByIdAndDelete(_id);
  }

  public async updateById(
    _id: string,
    newData: object
  ): Promise<IContent | null> {
    return await contentsDatabase.findByIdAndUpdate(_id, newData, {
      new: true
    });
  }

  public async update(
    queryFilter: object,
    data: object
  ): Promise<IContent | null> {
    return await contentsDatabase.findOneAndUpdate(
      queryFilter,
      {
        $set: data
      },
      { new: true }
    );
  }

  public async clone(
    content: IContent,
    directory: string,
    code: string
  ): Promise<IContent> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...data } = content;
    const _content = {
      ...data,
      directory,
      code,
      easyUrl: code,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await new contentsDatabase(_content).save();
  }

  public async addLogFile(_id: string, membershipId: string): Promise<boolean> {
    const timestamp = new Date();
    const logFile: ILogFile = {
      membershipId,
      timestamp
    };
    const query = await contentsDatabase.findByIdAndUpdate(_id, {
      $push: { logFile }
    });
    if (!query) return false;

    return true;
  }

  public async updateLimitContent(
    _id: string,
    limit: number
  ): Promise<boolean> {
    const updateLimit = await contentsDatabase.findByIdAndUpdate(
      _id,
      {
        limit
      },
      { new: true }
    );
    if (!updateLimit || updateLimit.limit !== limit) return false;

    return true;
  }

  public async updateExpiredContent(
    _id: string,
    expired: number
  ): Promise<boolean> {
    const updateExpired = await this.updateById(_id, { expired });
    if (!updateExpired || updateExpired.expired !== expired) return false;

    return true;
  }

  public async addShared(_id: string, membershipId: string): Promise<boolean> {
    const timestamp = new Date();
    const shared: IShared = { membershipId, timestamp };
    const query = await contentsDatabase.findByIdAndUpdate(_id, {
      $push: { shared }
    });
    if (!query) return false;
    const filterMemberShared = await this.filterShared(query, membershipId);
    if (filterMemberShared.length) return false;

    return true;
  }

  public async removeShared(
    _id: string,
    membershipId: string
  ): Promise<boolean> {
    const query = await contentsDatabase.findByIdAndUpdate(_id, {
      $pull: { shared: { membershipId } }
    });
    if (!query) return false;
    const filterMemberShared = await this.filterShared(query, membershipId);
    if (filterMemberShared.length) return false;

    return true;
  }

  private async filterShared(
    content: IContent,
    membershipId: string
  ): Promise<IShared[]> {
    const result = await Promise.all(
      content.shared.filter(
        (shared: IShared) => shared.membershipId === membershipId
      )
    );

    return result;
  }
}
