// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import BaseApi from '@api/base';
import TransactionService from '@services/transaction';

import TransactionHandler from './handler';

export default class TransactionApi extends BaseApi {
  constructor(
    service: TransactionService,
    endpoint = '/transaction',
    private readonly handler = new TransactionHandler(service)
  ) {
    super(endpoint);
    this.initRoute();
  }

  private initRoute(): void {
    this.router.post('/', this.handler.postHandler);
    this.router.get(
      '/membership/:membershipId',
      this.handler.getTxByMembershipIdHandler
    );
    this.router.post('/notification', this.handler.postNotificationHandler);
    this.router.get('/:txId', this.handler.getPaymentHandler);
    this.router.post('/voucher', this.handler.postVoucherHandler);
  }
}
