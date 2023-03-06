/* eslint-disable @typescript-eslint/no-explicit-any */
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import crypto from 'crypto';
import BaseHandler from '@api/base/handler';
import { IPaymentDetails } from '@interfaces/IPaymentGateway';
import ITransaction from '@interfaces/ITransaction';
import ITransactionService, {
  ICreatPayment
} from '@interfaces/ITransactionService';
import { Request, Response } from 'express';
import { MIDTRANS_SERVER_KEY } from '@config';

export default class TransactionHandler extends BaseHandler {
  constructor(private readonly service: ITransactionService) {
    super();
    this.postHandler = this.postHandler.bind(this);
    this.postNotificationHandler = this.postNotificationHandler.bind(this);
    this.getPaymentHandler = this.getPaymentHandler.bind(this);
    this.getTxByMembershipIdHandler =
      this.getTxByMembershipIdHandler.bind(this);
  }

  public async postHandler(req: Request, res: Response): Promise<Response> {
    try {
      const {
        packageId,
        paymentMethod,
        membershipId,
        phoneNumber
      }: ICreatPayment = req.body;
      const data: ITransaction = await this.service.save({
        packageId,
        paymentMethod,
        membershipId,
        phoneNumber
      });
      return super.render(res, 201, {
        status: 'success',
        message: 'Transaction saved!',
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async postNotificationHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const payload = req.body;
      const data: IPaymentDetails = await this.service.notification(payload);
      const signature = `${payload.order_id}${payload.status_code}${payload.gross_amount}${MIDTRANS_SERVER_KEY}`;
      const sha512 = await this.sha512(signature);
      if (sha512 !== payload.signature_key) {
        throw new Error('Signature key is not valid!');
      }

      return super.render(res, 200, {
        status: 'success',
        message: 'Transaction notification!',
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async getPaymentHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { txId } = req.params;
      const data = await this.service.getByTxId(txId);
      return super.render(res, 201, {
        status: 'success',
        message: 'Transaction notification!',
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async postVoucherHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { publicAddress, voucher } = req.body;
      if (
        typeof voucher !== 'string' ||
        typeof publicAddress !== 'string' ||
        voucher === '' ||
        publicAddress === ''
      )
        return super.render(res, 400, {
          status: 'success',
          message: 'Mohon maaf fitur ini belum diaktifkan!'
        });
      return super.render(res, 200, {
        status: 'success',
        message: 'Mohon maaf fitur ini belum diaktifkan!'
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  public async getTxByMembershipIdHandler(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { membershipId } = req.params;
      const data = await this.service.getByMembershipId(membershipId);
      return super.render(res, 200, {
        status: 'success',
        message: 'Transaction by membershipId!',
        data
      });
    } catch (error: any) {
      return super.renderError(res, error);
    }
  }

  // TODO rescue add sign transaction
  private async sha512(data: string): Promise<string> {
    return crypto.createHash('sha512').update(data).digest('hex');
  }
}
