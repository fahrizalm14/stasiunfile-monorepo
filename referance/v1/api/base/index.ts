// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IApi from '@interfaces/IApi';
import { Router } from 'express';

export default class BaseApi implements IApi {
  public router: Router = Router();
  constructor(public endpoint: string) {}
}
