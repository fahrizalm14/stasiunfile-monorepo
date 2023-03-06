// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// export interface ICompanyContent {
//   title: string;
//   image: string;
//   description: string;
// }

export interface ICompanyService {
  get(): Promise<ICompany>;
  update(_id: string, data: ICompany): Promise<ICompany>;
  // addReport(data: { sender: string; description: string }): Promise<boolean>;
  // update(_id: string, newData: object): Promise<ICompany>;
  // getCompany(): Promise<ICompany>;
  // addService(data: ICompanyContent): Promise<boolean>;
  // addInvestment(data: ICompanyContent): Promise<boolean>;
  // addPrivacyPolicy(data: {
  //   pointTitle: string;
  //   description: string;
  // }): Promise<boolean>;
  // updatePrivacyPolicy(_id: string, idPrivacyPoint: string): Promise<boolean>;
}
export default interface ICompany {
  _id?: string;
  website: string;
  // contact: { email: string; phoneNumber: string; address: string };
  // blogLink: string;
  // about: string;
  // services: ICompanyContent[];
  // investment: ICompanyContent[];
  // title hardcode
  // privacyPolicy: [
  //   {
  //     pointTitle: string;
  //     description: string;
  //   }
  // ];
  // report: [
  //   {
  //     sender: string;
  //     description: string;
  //   }
  // ];
}
