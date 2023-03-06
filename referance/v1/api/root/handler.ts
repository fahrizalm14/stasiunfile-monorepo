/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseHandler from '@api/base/handler';
import { Request, Response } from 'express';

export default class RootHandler extends BaseHandler {
  private readonly epoch: number = Date.now();
  constructor() {
    super();
    this.getHandler = this.getHandler.bind(this);
    this.notFoundHandler = this.notFoundHandler.bind(this);
  }
  public async getHandler(_req: Request, res: Response): Promise<Response> {
    try {
      return super.render(res, 200, {
        status: 'success',
        message: 'StasiunFile ' + this.epoch
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async notFoundHandler(
    _req: Request,
    res: Response
  ): Promise<Response> {
    try {
      return super.render(res, 404, {
        status: 'error',
        message: 'Not found'
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }
}
