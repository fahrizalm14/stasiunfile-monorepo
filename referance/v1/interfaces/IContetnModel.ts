// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IContent from '@interfaces/IContent';

export default interface IContentModel {
  // Dikasih versi contents V1.0.0
  save(newContent: IContent): Promise<IContent>;
  find(queryFilter: object): Promise<IContent[]>;
  getAll(): Promise<IContent[]>;
  getById(_id: string): Promise<IContent | null>;
  delete(_id: string): Promise<IContent | null>;
  updateById(_id: string, newData: object): Promise<IContent | null>;
  update(queryFilter: object, data: object): Promise<IContent | null>;
  clone(content: IContent, directory: string, code: string): Promise<IContent>;
  addLogFile(_id: string, publicAddress: string): Promise<boolean>;
  updateLimitContent(_id: string, limit: number): Promise<boolean>;
  updateExpiredContent(_id: string, expired: number): Promise<boolean>;
  addShared(_id: string, membershipId: string): Promise<boolean>;
  removeShared(_id: string, membershipId: string): Promise<boolean>;
  insertMany(contents: IContent[]): Promise<IContent[]>;
}
