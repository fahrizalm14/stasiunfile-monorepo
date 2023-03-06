// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import IMembership from '@interfaces/IMembership';
import { Model, model, Schema } from 'mongoose';

const membershipSchema: Schema<IMembership> = new Schema({
  publicAddress: String,
  storage: Number,
  expired: Number,
  phoneNumber: String,
  nonce: String,
  createdAt: Date,
  updatedAt: Date,
  memberStatus: String,
});

export const membershipsDatabse: Model<IMembership> = model(
  "memberships",
  membershipSchema
);
