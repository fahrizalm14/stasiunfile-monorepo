// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseApi from '@api/base';
import { ICompanyService } from '@interfaces/ICompany';

import CompanyHandler from './handler';

export default class CompanyApi extends BaseApi {
  constructor(
    private readonly service: ICompanyService,
    readonly endpoint = "/company",
    private readonly handler: CompanyHandler = new CompanyHandler(service)
  ) {
    super(endpoint);
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get("/", this.handler.get);
    this.router.put("/:_id", this.handler.update);
    this.router.get("/quote", this.handler.quote);
  }
}
