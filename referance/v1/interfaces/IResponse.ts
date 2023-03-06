// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export interface IResRegisterOrLogin {
  token: string;
  refreshToken: string;
  membershipId: string;
  publicAddress: string;
  phoneNumber: string;
  expired: string;
  storage: string;
}
