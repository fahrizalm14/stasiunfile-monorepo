// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IPackage from '@interfaces/IPackage';

export default interface IPackageService {
  getAll(): Promise<IPackage[]>;
  getById(_id: string): Promise<IPackage>;
  save(payload: IPackage): Promise<IPackage>;
  delete(_id: string): Promise<boolean>;
  activate(_id: string): Promise<boolean>;
  deactivate(_id: string): Promise<boolean>;
}
