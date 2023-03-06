// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { InvariantError, NotFoundError } from '@error';
import IMembership from '@interfaces/IMembership';
import IMembershipService from '@interfaces/IMembershipService';
import IPackage from '@interfaces/IPackage';
import IPackageService from '@interfaces/IPackageService';
import IPaymentGateway, { IPaymentDetails } from '@interfaces/IPaymentGateway';
import ITransaction, { IResTxByMembershipId } from '@interfaces/ITransaction';
import ITransactionModel from '@interfaces/ITransactionModel';
import ITransactionService, {
  ICreatPayment
} from '@interfaces/ITransactionService';
import { PackageStatus, TransactionStatus } from '@utils/type';

import TransactionValidation from './validation';
import bytes from 'bytes';
import Firebase from '@plugins/Firebase';

// TODO Tambah validai untuk add transaksi harus login

/**
 * @class TransactionService
 * @param model ITransactionModel
 * @param options options?:
 * {membershipService?: IMembershipService;
 * packageService?: IPackageService;
 * paymentGateWay?: IPaymentGateway;}
 * @instance IMembershipService
 * @instance IPackageService
 * @instance IPaymentGateway
 * @instance ITransactionModel
 * @instance TransactionValidation
 */
export default class TransactionService implements ITransactionService {
  private readonly validator: TransactionValidation =
    new TransactionValidation();
  private readonly messaging = Firebase;

  constructor(
    private readonly model: ITransactionModel,
    private readonly membershipService: IMembershipService,
    private readonly packageService: IPackageService,
    private readonly paymentGateWay: IPaymentGateway
  ) {}
  async getByMembershipId(
    membershipId: string
  ): Promise<IResTxByMembershipId[]> {
    await this.validator.isMongo(membershipId);
    const data = await this.model.findByMembershipId(membershipId);
    const result: IResTxByMembershipId[] = data.map((item: ITransaction) => {
      const { _id, packages, details, status, createdAt, paidAt } = item;
      return {
        _id,
        packageName: packages.name,
        orderId: details?.order_id,
        expired: Math.floor(packages.expired / 86400000 / 30),
        storage: bytes(packages.storage),
        totalAmount: packages.price.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }),
        virtualAccount: details?.virtualAccount,
        status,
        createdAt,
        paidAt
      };
    });

    return result;
  }

  /**
   * Create payment and send to payment gateway and save to
   * database.
   * @method save
   * @param payload ICreatPayment
   * @returns `Promise<ITransaction>`
   * @throws InvariantError(message)
   * @throws InvariantError("Package not active!")
   * @throws InvariantError(message)
   */
  public async save(payload: ICreatPayment): Promise<ITransaction> {
    // Validating payload value
    await this.validator.save(payload);

    // Checking package from package service
    const {
      packageId,
      paymentMethod,
      membershipId,
      phoneNumber
    }: ICreatPayment = payload;
    const packages: IPackage = await this.packageService
      .getById(packageId)
      .catch((e) => {
        const message = e && e.message ? e.message : 'untracked';
        console.log(`Package service error: ${message}`);
        throw new InvariantError(message);
      });
    if (packages.status === PackageStatus.NOT_ACTIVE) {
      throw new InvariantError('Package not active!');
    }

    // Get membership info from membership service
    const membership: IMembership = await this.membershipService.getById(
      membershipId
    );

    // !!! phone number
    // ??? Validation?
    // Send order to payment gateway
    const details = await this.paymentGateWay
      .charge(packages, paymentMethod, membership)
      .catch((e) => {
        const message = e && e.message ? e.message : 'untracked';
        console.log(`Payment gateway error: ${message}`);
        throw new InvariantError(message);
      });
    console.log(details);

    // Saving transaction to database.

    const transaction: ITransaction = await this.model.save({
      packages,
      details,
      phoneNumber,
      membershipId,
      status: TransactionStatus.PENDING,
      createdAt: new Date()
    });

    return transaction;
  }

  /**
   * Notification payment handler from payment gateway
   * @webhook
   * @method notification
   * @param data Generic response from payment gateway
   * @returns `Promise<IPaymentDetails>`
   * @throws InvariantError(message)
   * @throws InvariantError(message)
   * @throws InvariantError("Payment failed!")
   * @throws InvariantError(message)
   * @throws InvariantError(message)
   */
  public async notification<T>(data: T): Promise<IPaymentDetails> {
    // Validating data value
    await this.validator.notification(data);
    // Get notification from payment gateway server
    const response: IPaymentDetails = await this.paymentGateWay
      .notification(data)
      .catch((e) => {
        const message = e && e.message ? e.message : 'untracked';
        console.log(`Notification payment gateway error: ${message}`);
        throw new InvariantError(message);
      });

    // Parse transaction_id from response
    const txId = response.transaction_id;
    // Get transaction id from database
    const transaction = await this.model.findByTxId(txId);
    if (!transaction) throw new InvariantError('Transaction not found!');

    // Get membership info from membershipService
    const membership: IMembership = await this.membershipService
      .getById(transaction.membershipId)
      .catch((e) => {
        const message = e && e.message ? e.message : 'untracked';
        console.log(`Membership service error: ${message}`);

        throw new InvariantError(message);
      });

    let expired: number;
    //* Checking transaction status
    // Jika  sudah terbayar
    if (response.transaction_status === TransactionStatus.SETTLEMENT) {
      // Update transaction status as paid
      const pay = await this.model.payWithTxId(txId);
      if (!pay) throw new NotFoundError('Transaction not found!');
      if (pay.status !== TransactionStatus.PAID)
        throw new InvariantError('Payment failed!');

      // Update membership status as active
      await this.membershipService
        .activate(transaction.membershipId)
        .catch((e) => {
          const message = e && e.message ? e.message : 'untracked';
          console.log(`Membership service error: ${message}`);

          throw new InvariantError(message);
        });

      // If membership expired is lower than date now
      // Just adding as packge expired
      // if (membership.expired < Date.now())
      expired = Date.now() + transaction.packages.expired;
      // If more than date now
      // Calculate sisa expired and package expired
      // else expired = membership.expired + transaction.packages.expired;
      // Update membership storage and expired from membership service
      await this.membershipService
        .updateById(transaction.membershipId, {
          expired,
          storage: transaction.packages.storage
        })
        .catch((e) => {
          const message = e && e.message ? e.message : 'untracked';
          console.log(`Membership service error: ${message}`);

          throw new InvariantError(message);
        });
      this.messaging.sendNotification(
        `Transaksi Sukses!`,
        `Selamat kamu berhasil membeli paket ${bytes(
          transaction.packages.storage
        )} / ${Math.floor(
          transaction.packages.expired / 86400000 / 30
        )} bulan, senilai ${transaction.packages.price.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR'
        })}, silahkan cek akun kamu.`,
        membership.publicAddress
      );
    } else if (
      response.transaction_status === TransactionStatus.CANCEL ||
      response.transaction_status === TransactionStatus.EXPIRE ||
      response.transaction_status === TransactionStatus.DENY
    ) {
      // If failure
      // Set  status transaction to failure
      await this.model.failureWithTxId(txId);
      // TODO set membership
      // const member = await this.membershipService
      //   .deactivate(transaction.membershipId)
      //   .catch((e) => {
      //     const message = e && e.message ? e.message : 'untracked';
      //     console.log(`Membership service error: ${message}`);

      //     throw new InvariantError(message);
      //   });
      this.messaging.sendNotification(
        `Transaksi Gagal!`,
        `Mohon maaf transaksi pembelian paket ${bytes(
          transaction.packages.storage
        )} / ${Math.floor(
          transaction.packages.expired / 86400000 / 30
        )} bulan, senilai ${transaction.packages.price.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR'
        })} gagal, silahkan ulangi transaksi.`,
        membership.publicAddress
      );
    } else if (response.transaction_status === TransactionStatus.PENDING)
      // If pending
      // Set status to pending
      await this.model.pendingWithTxId(txId);

    return response;
  }

  /**
   * Getting transaction detail with transaction_id
   * @method getByTxId
   * @param txId string
   * @returns `Promise<ITransaction>`
   * @throws InvariantError(message)
   * @throws InvariantError(message)
   * @throws InvariantError(message)
   * @throws InvariantError(message)
   * @throws InvariantError(message)
   * @throws NotFoundError("Transaction not found!")
   */

  public async getByTxId(txId: string): Promise<ITransaction> {
    await this.validator.getByTxId(txId);
    const response: IPaymentDetails = await this.paymentGateWay
      .status(txId)
      .catch((e) => {
        const message = e && e.message ? e.message : 'untracked';
        console.log(`Payment gateway error: ${message}`);
        throw new NotFoundError('Transaction not found!');
      });

    const transaction = await this.model.findByTxId(txId);
    if (!transaction) throw new InvariantError('Transaction not found!');

    // const membership: IMembership = await this.membershipService
    //   .getById(transaction.membershipId)
    //   .catch((e) => {
    //     const message = e && e.message ? e.message : "untracked";
    //     console.log(`Membership service error: ${message}`);

    //     throw new InvariantError(message);
    //   });

    let resTransaction: ITransaction | null;
    if (response.transaction_status === TransactionStatus.SETTLEMENT) {
      resTransaction = await this.model.payWithTxId(txId);
      if (!resTransaction) throw new NotFoundError('Transaction not found!');
      if (resTransaction.status !== TransactionStatus.PAID)
        throw new InvariantError('Payment failed!');

      await this.membershipService
        .activate(transaction.membershipId)
        .catch((e) => {
          const message = e && e.message ? e.message : 'untracked';
          console.log(`Membership service error: ${message}`);

          throw new InvariantError(message);
        });

      let expired: number;
      // if (membership.expired < Date.now())
      // eslint-disable-next-line prefer-const
      expired = transaction.packages.expired;
      // else expired = membership.expired + transaction.packages.expired;
      await this.model.payWithTxId(txId);
      await this.membershipService
        .updateById(transaction.membershipId, {
          expired,
          storage: transaction.packages.storage
        })
        .catch((e) => {
          const message = e && e.message ? e.message : 'untracked';
          console.log(`Membership service error: ${message}`);

          throw new InvariantError(message);
        });
    } else if (
      response.transaction_status === TransactionStatus.CANCEL ||
      response.transaction_status === TransactionStatus.EXPIRE ||
      response.transaction_status === TransactionStatus.DENY
    ) {
      resTransaction = await this.model.failureWithTxId(txId);
      // await this.membershipService
      //   .deactivate(transaction.membershipId)
      //   .catch((e) => {
      //     const message = e && e.message ? e.message : 'untracked';
      //     console.log(`Membership service error: ${message}`);

      //     throw new InvariantError(message);
      //   });
    } else if (response.transaction_status === TransactionStatus.PENDING)
      resTransaction = await this.model.pendingWithTxId(txId);
    else resTransaction = null;

    if (!resTransaction) throw new NotFoundError('Transaction not found!');
    return resTransaction;
  }
}
