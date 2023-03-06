// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ITransaction from '@interfaces/ITransaction';
import { Model, model, Schema } from 'mongoose';

export const transactionShema: Schema<ITransaction> = new Schema({
  membershipId: String,
  phoneNumber: String,
  packages: Object,
  details: Object,
  createdAt: Date,
  status: String,
  paidAt: Date,
});

export const packagesDatabase: Model<ITransaction> = model(
  "transactions",
  transactionShema
);
