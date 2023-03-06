// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { InvariantError } from '@error';
import { ICreatPayment } from '@interfaces/ITransactionService';
import { isValidObjectId } from 'mongoose';

/**
 * Class TransactionValidation
 * Checking payload and throw error `400 bad request`
 * @class TransactionValidation
 */
export default class TransactionValidation {
  /**
   * Save validation
   * @method save
   * @param payload ICreatPayment
   * @returns ` Promise<void>`
   * @throws InvariantError("Package id invalid value!")
   * @throws InvariantError("Payment method invalid value!")
   * @throws InvariantError("Membership id invalid value!")
   * @throws InvariantError("Phone number method invalid value!")
   */
  public async save(payload: ICreatPayment): Promise<void> {
    const {
      packageId,
      paymentMethod,
      membershipId,
      phoneNumber
    }: ICreatPayment = payload;

    if (!isValidObjectId(packageId) || !packageId)
      throw new InvariantError('Package id invalid value!');
    if (!paymentMethod || typeof paymentMethod !== 'string')
      throw new InvariantError('Payment method invalid value!');
    if (!isValidObjectId(membershipId) || !membershipId)
      throw new InvariantError('Membership id invalid value!');
    if (phoneNumber === '' || typeof phoneNumber !== 'string')
      throw new InvariantError('Phone number method invalid value!');
  }

  /**
   * Notification validation
   * @method notification
   * @param data Generic from webhook payment gateway
   * @returns `Promise<void>`
   * @throws InvariantError("Response body invalid!")
   */
  public async notification<T>(data: T): Promise<void> {
    if (!data) throw new InvariantError('Response body invalid!');
  }

  /**
   * Get transaction validation
   * @method getByTxId
   * @param txId string
   * @returns `Promise<void>`
   * @throws InvariantError("Transaction id invalid value!")
   */
  public async getByTxId(txId: string): Promise<void> {
    if (txId === '' || typeof txId !== 'string')
      throw new InvariantError('Transaction id invalid value!');
  }

  public async isMongo(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new InvariantError('Id invalid value!');
  }
}
