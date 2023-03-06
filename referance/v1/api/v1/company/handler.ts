/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseHandler from '@api/base/handler';
import ICompany, { ICompanyService } from '@interfaces/ICompany';
import { Request, Response } from 'express';

// url privacy, profile, contact, about, etc
export default class CompanyHandler extends BaseHandler {
  constructor(private readonly service: ICompanyService) {
    super();
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
  }

  public async get(_req: Request, res: Response): Promise<Response> {
    try {
      return super.render(res, 200, {
        status: 'success',
        data: {
          contact: 'https://stasiunfile.my.id/',
          about: 'https://stasiunfile.my.id/',
          website: 'https://stasiunfile.my.id/'
        }
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { website }: { website: string } = req.body;
      const data: ICompany = await this.service.update(req.params._id, {
        website
      });
      return super.render(res, 200, {
        status: 'success',
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async quote(_req: Request, res: Response): Promise<Response> {
    try {
      return super.render(res, 200, {
        status: 'success',
        data: 'This is a quote'
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }
}
