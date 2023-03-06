// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseApi from '@api/base';
import AuthServices from '@services/auth';

import AuthHandler from './handler';

export default class PackageApi extends BaseApi {
  constructor(
    service: AuthServices,
    endpoint = '/auth',
    private readonly handler: AuthHandler = new AuthHandler(service)
  ) {
    super(endpoint);
    this.initRouter();
  }

  private initRouter(): void {
    this.router.post('/register', this.handler.registerHandler);
    this.router.post('/login', this.handler.loginHandler);
    this.router.post('/pre_login', this.handler.preLoginHandler);
    this.router.post('/web3_login', this.handler.web3LoginHandler);
    this.router.post('/mobile_login', this.handler.mobileLogin);
    this.router.post('/signature', this.handler.signatureHandler);
    this.router.post('/token', this.handler.refreshToken);
  }
}
