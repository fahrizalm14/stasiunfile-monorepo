import { IResRegisterOrLogin } from '@interfaces/IResponse';
import bytes from 'bytes';

export default class AuthResponseAdapter implements IResRegisterOrLogin {
  token: string;
  refreshToken: string;
  membershipId: string;
  publicAddress: string;
  phoneNumber: string;
  expired = "";
  storage = "0 KB";
  private static storageNumber: number;
  private static expiredNumber: number;
  constructor(IResRegisterOrLogin: {
    token: string;
    refreshToken: string;
    membershipId: string;
    publicAddress: string;
    phoneNumber: string;
    expired: number;
    storage: number;
  }) {
    this.token = IResRegisterOrLogin.token;
    this.refreshToken = IResRegisterOrLogin.refreshToken;
    this.membershipId = IResRegisterOrLogin.membershipId;
    this.phoneNumber = IResRegisterOrLogin.phoneNumber;
    this.publicAddress = IResRegisterOrLogin.publicAddress;
    AuthResponseAdapter.storageNumber = IResRegisterOrLogin.storage;
    AuthResponseAdapter.expiredNumber = IResRegisterOrLogin.expired;
    this.initial();
  }

  private initial(): void {
    const _expired = new Date(AuthResponseAdapter.expiredNumber);
    this.expired = _expired.toISOString();
    this.storage = bytes(AuthResponseAdapter.storageNumber);
  }
}
