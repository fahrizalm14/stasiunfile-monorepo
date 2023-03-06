// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ITransaction from '@interfaces/ITransaction';
import ITransactionModel, {
  ISaveTransaction
} from '@interfaces/ITransactionModel';
import { TransactionStatus } from '@utils/type';

import { packagesDatabase } from './database';

export default class TransactionModel implements ITransactionModel {
  public async save(data: ISaveTransaction): Promise<ITransaction> {
    const newTx = new packagesDatabase(data);

    return await newTx.save();
  }

  public async getById(_id: string): Promise<ITransaction | null> {
    const query = await packagesDatabase.findById(_id);

    return query;
  }

  public async getUnpaid(): Promise<ITransaction[]> {
    const query = await packagesDatabase
      .find({
        status: TransactionStatus.UNPAID
      })
      .lean();

    return query;
  }

  public async getPaid(): Promise<ITransaction[]> {
    const query = await packagesDatabase
      .find({
        status: TransactionStatus.PAID
      })
      .lean();

    return query;
  }

  public async getAll(): Promise<ITransaction[]> {
    const query = await packagesDatabase.find().lean();

    return query;
  }

  public async pay(_id: string): Promise<ITransaction | null> {
    const query = await packagesDatabase.findByIdAndUpdate(
      _id,
      {
        $set: { status: TransactionStatus.PAID, paidAt: new Date() }
      },
      { new: true }
    );

    return query;
  }

  public async unpay(_id: string): Promise<ITransaction | null> {
    const query = await packagesDatabase.findByIdAndUpdate(
      _id,
      {
        $set: { status: TransactionStatus.UNPAID, paidAt: null }
      },
      { new: true }
    );
    return query;
  }

  public async delete(_id: string): Promise<boolean> {
    const query = await packagesDatabase.findByIdAndDelete(_id);

    return true;
  }
  public async payWithTxId(txId: string): Promise<ITransaction | null> {
    const query = await packagesDatabase.findOneAndUpdate(
      { 'details.transaction_id': txId },
      {
        $set: { status: TransactionStatus.PAID, paidAt: null }
      },
      { new: true }
    );

    return query;
  }
  public async failureWithTxId(txId: string): Promise<ITransaction | null> {
    const query = await packagesDatabase.findOneAndUpdate(
      { 'details.transaction_id': txId },
      {
        $set: { status: TransactionStatus.FAILURE, paidAt: null }
      },
      { new: true }
    );

    return query;
  }

  public async pendingWithTxId(txId: string): Promise<ITransaction | null> {
    const query = await packagesDatabase.findOneAndUpdate(
      { 'details.transaction_id': txId },
      {
        $set: { status: TransactionStatus.PENDING }
      },
      { new: true }
    );

    return query;
  }
  public async findByTxId(txId: string): Promise<ITransaction | null> {
    const query = await packagesDatabase.findOne({
      'details.transaction_id': txId
    });

    return query;
  }
  public async findByMembershipId(
    membershipId: string
  ): Promise<ITransaction[]> {
    return await packagesDatabase
      .find({
        membershipId
      })
      .lean();
  }
}
