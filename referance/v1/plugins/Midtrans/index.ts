// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_IS_PRODUCTION,
  MIDTRANS_SERVER_KEY
} from '@config';
import InvariantError from '@error/InvariantError';
import IMembership from '@interfaces/IMembership';
import IPackage from '@interfaces/IPackage';
import IPaymentGateway, {
  IGopayDetail,
  IPaymentDetails,
  IQrisDetail,
  IVirtualAccountDetail
} from '@interfaces/IPaymentGateway';
import { BankName, PaymentType } from '@utils/type';
import { MidtransClient } from 'midtrans-node-client';

import MidtransHelper from './helper';

export default class MidtransPayment implements IPaymentGateway {
  private readonly core: MidtransClient.CoreApi = new MidtransClient.CoreApi({
    isProduction: MIDTRANS_IS_PRODUCTION,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY
  });
  public async charge(
    packages: IPackage,
    paymentMethod: PaymentType | BankName,
    membership: IMembership
  ): Promise<IGopayDetail | IQrisDetail | IVirtualAccountDetail> {
    const payment = new MidtransHelper(
      {
        gross_amount: packages.price,
        order_id: `SF-${Date.now()}`
      },
      [
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          id: packages._id!,
          price: packages.price,
          quantity: 1,
          name: packages.name
        }
      ],
      {
        phone: membership.phoneNumber,
        first_name: membership.publicAddress
      }
    );

    let paymentType;
    if (paymentMethod === BankName.BNI) {
      paymentType = await payment.bniVirtualAccount();
    } else if (paymentMethod === PaymentType.GOPAY) {
      paymentType = await payment.gopayApp();
    } else if (paymentMethod === PaymentType.QRIS) {
      paymentType = await payment.qrisScan();
    } else if (paymentMethod === BankName.PERMATA) {
      paymentType = await payment.permataVirtualAccount();
    } else {
      throw new InvariantError('Payment method unknown!');
    }

    const response = await this.core.charge(paymentType);
    const detail: IPaymentDetails = this.convertResponse(response);

    if (response.payment_type === PaymentType.GOPAY)
      return { ...detail, gopayDeeplink: response.actions[1].url };
    else if (response.payment_type === PaymentType.QRIS)
      return {
        ...detail,
        generateQris: response.actions[0].url,
        qrString: response.qr_string
      };
    else if (response.permata_va_number)
      return {
        ...detail,
        virtualAccount: response.permata_va_number,
        bank: BankName.PERMATA
      };
    else if (response.va_numbers)
      return {
        ...detail,
        virtualAccount: response.va_numbers[0].va_number,
        bank: response.va_numbers[0].bank
      };
    else
      return {
        ...detail,
        virtualAccount: response.permata_va_number,
        bank: BankName.PERMATA
      };
  }

  public async notification<T>(jsonResponse: T): Promise<IPaymentDetails> {
    const response = await this.core.transaction.notification(jsonResponse);
    const detail: IPaymentDetails = this.convertResponse(response);
    return detail;
  }

  public async status<T>(txId: T): Promise<IPaymentDetails> {
    const response = await this.core.transaction.status(
      txId as unknown as string
    );
    const detail: IPaymentDetails = this.convertResponse(response);

    return detail;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private convertResponse(response: any): IPaymentDetails {
    return {
      transaction_id: response.transaction_id,
      order_id: response.order_id,
      payment_type: response.payment_type,
      gross_amount: response.gross_amount,
      transaction_time: response.transaction_time,
      transaction_status: response.transaction_status
    };
  }
}
