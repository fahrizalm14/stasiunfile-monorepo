/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseHandler from '@api/base/handler';
import IPackage from '@interfaces/IPackage';
import PackageService from '@services/package';
import { Request, Response } from 'express';

export default class PackageHandler extends BaseHandler {
  constructor(private readonly service: PackageService) {
    super();
    this.getHandler = this.getHandler.bind(this);
    this.postHandler = this.postHandler.bind(this);
    this.getByIdHandler = this.getByIdHandler.bind(this);
    this.activateHandler = this.activateHandler.bind(this);
    this.deactivateHandler = this.deactivateHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  public async getHandler(_req: Request, res: Response): Promise<Response> {
    try {
      const data: IPackage[] = await this.service.getAll();
      return super.render(res, 200, {
        status: "success",
        message: "Packages success rendered!",
        data,
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async postHandler(req: Request, res: Response): Promise<Response> {
    try {
      const { name, price, storage, expired }: IPackage = req.body;
      const data: IPackage = await this.service.save({
        name,
        price,
        storage,
        expired,
      });
      return super.render(res, 201, {
        status: "success",
        message: "Package saved!",
        data,
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }
  public async getByIdHandler(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.params;

      const data: IPackage = await this.service.getById(_id);
      return super.render(res, 200, {
        status: "success",
        message: "Package found!",
        data,
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async activateHandler(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.params;
      await this.service.activate(_id);

      return super.render(res, 200, {
        status: "success",
        message: `Activing package ${_id} success!`,
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async deactivateHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { _id } = req.params;
      await this.service.deactivate(_id);
      return super.render(res, 200, {
        status: "success",
        message: `Deactiving package ${_id} success!`,
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async deleteHandler(req: Request, res: Response): Promise<Response> {
    try {
      const { _id } = req.params;
      await this.service.delete(_id);
      return super.render(res, 202, {
        status: "success",
        message: `Deleting package ${_id} success!`,
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }
}
