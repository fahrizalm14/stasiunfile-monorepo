// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export type AccountKey = {
  publicAddress: string;
  key: string;
};

export enum MemberStatus {
  Active = 'active',
  NotActive = 'notActive',
  Expired = 'expired'
}

export enum PackageStatus {
  ACTIVE = 'active',
  NOT_ACTIVE = 'notActive'
}

export enum TransactionStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  FAILURE = 'failure',
  PENDING = 'pending',
  SETTLEMENT = 'settlement',
  EXPIRE = 'expire',
  CANCEL = 'cancel',
  DENY = 'deny'
}

export enum BankName {
  BNI = 'bni',
  PERMATA = 'permata'
}

export enum PaymentType {
  BANK_TRANSFER = 'bank_transfer',
  CS_STORE = 'cstore',
  QRIS = 'qris',
  GOPAY = 'gopay',
  EMPTY_STRING = ''
}

export enum Content {
  FILE = 'file',
  DIRECTORY = 'directory'
}

export enum ContentType {
  DIRECTORY = 'sf/directory'
}

export enum FileStatus {
  TRASH = 'trash',
  ACTIVE = 'active',
  DELETED = 'deleted'
}
