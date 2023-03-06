// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseApi from '@api/base';
import Packageservice from '@services/package';
import PackageHandler from './handler';

export default class PackageApi extends BaseApi {
  constructor(
    service: Packageservice,
    endpoint = '/package',
    private readonly handler: PackageHandler = new PackageHandler(service)
  ) {
    super(endpoint);
    this.initRouter();
  }

  private initRouter(): void {
    this.router.get('/', this.handler.getHandler);
    this.router.post('/', this.handler.postHandler);
    this.router.get('/:_id', this.handler.getByIdHandler);
    this.router.put('/:_id/activate', this.handler.activateHandler);
    this.router.put('/:_id/deactivate', this.handler.deactivateHandler);
    this.router.delete('/:_id', this.handler.deleteHandler);
  }
}
