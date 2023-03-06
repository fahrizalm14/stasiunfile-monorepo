// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Express, Router } from 'express';


export interface IApiServer {
  app: Express;
}
export default interface IApi {
  router: Router;
  readonly endpoint: string;
}
