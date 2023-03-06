// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IMembership from '@interfaces/IMembership';
import IRegister from '@interfaces/IRegister';


export default interface IMembershipService {
  save(payload: IRegister): Promise<IMembership>;
  getByPublicAddress(publicAddress: string): Promise<IMembership | null>;
  checkPhoneNumber(phoneNumber: string): Promise<void>;
  updateById(_id: string, newData: object): Promise<IMembership>;
  getById(_id: string): Promise<IMembership>;
  activate(_id: string): Promise<IMembership>;
  deactivate(_id: string): Promise<IMembership>;
  terminate(_id: string): Promise<IMembership>;
}
