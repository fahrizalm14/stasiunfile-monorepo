// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT;
import { IResRegisterOrLogin } from '@interfaces/IResponse';

export default interface IAuthService {
  register(
    publicAddress: string,
    phoneNumber: string
  ): Promise<IResRegisterOrLogin>;
  login(
    publicAddress: string,
    message: string,
    signature: string
  ): Promise<IResRegisterOrLogin>;
  preLogin(publicAddress: string): Promise<string>;
  web3Login(
    publicAddress: string,
    signature: string
  ): Promise<IResRegisterOrLogin>;
  refreshToken(token?: string): Promise<IResRegisterOrLogin>;
  generateSignatureWeb3(key: string, message: string): Promise<string>;
  mobileLogin(
    publicAddress: string,
    signature: {
      v: string;
      r: string;
      s: string;
    }
  ): Promise<IResRegisterOrLogin>;
  generateSignatureMobile(signature: {
    v: string;
    r: string;
    s: string;
    msg: string;
  }): Promise<string>;
}
