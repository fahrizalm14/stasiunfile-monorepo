/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseHandler from '@api/base/handler';
import { IResRegisterOrLogin } from '@interfaces/IResponse';
import AuthService from '@services/auth';
import { Request, Response } from 'express';

export default class AuthHandler extends BaseHandler {
  constructor(private readonly service: AuthService) {
    super();
    this.registerHandler = this.registerHandler.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.preLoginHandler = this.preLoginHandler.bind(this);
    this.web3LoginHandler = this.web3LoginHandler.bind(this);
    this.signatureHandler = this.signatureHandler.bind(this);
    this.mobileLogin = this.mobileLogin.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }
  public async registerHandler(req: Request, res: Response): Promise<Response> {
    try {
      const {
        publicAddress,
        phoneNumber
      }: { publicAddress: string; phoneNumber: string } = req.body;
      const data: IResRegisterOrLogin = await this.service.register(
        publicAddress,
        phoneNumber
      );

      return super.render(res, 201, {
        status: 'success',
        message: 'Registration success!',
        ...data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async loginHandler(req: Request, res: Response): Promise<Response> {
    try {
      const {
        publicAddress,
        message,
        signature
      }: { publicAddress: string; message: string; signature: string } =
        req.body;

      const { token, refreshToken }: IResRegisterOrLogin =
        await this.service.login(publicAddress, message, signature);

      return super.render(res, 200, {
        status: 'success',
        message: 'Login success!',
        token,
        refreshToken
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async preLoginHandler(req: Request, res: Response): Promise<Response> {
    try {
      const { publicAddress } = req.body;
      const message = await this.service.preLogin(publicAddress);
      return super.render(res, 200, {
        status: 'success',
        message
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async mobileLogin(req: Request, res: Response): Promise<Response> {
    try {
      const { publicAddress, signature } = req.body;

      const data: IResRegisterOrLogin = await this.service.mobileLogin(
        publicAddress,
        signature
      );

      return super.render(res, 200, {
        status: 'success',
        message: 'Login success!',
        ...data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }
  public async web3LoginHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { publicAddress, signature } = req.body;

      const data: IResRegisterOrLogin = await this.service.web3Login(
        publicAddress,
        signature
      );

      return super.render(res, 200, {
        status: 'success',
        message: 'Login success!',
        ...data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async signatureHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { key, message } = req.body;
      const signature: string = await this.service.generateSignatureWeb3(
        key,
        message
      );

      return super.render(res, 201, {
        status: 'success',
        message: 'Signature created!',
        signature
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.body;
      const data: IResRegisterOrLogin = await this.service.refreshToken(
        refreshToken
      );

      return super.render(res, 200, {
        status: 'success',
        message: 'Login success!',
        ...data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }
}
