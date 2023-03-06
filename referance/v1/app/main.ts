// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import AuthApi from '@api/v1/auth';
import CompanyApi from '@api/v1/company';
import ContentApi from '@api/v1/content';
import PackageApi from '@api/v1/package';
import TransactionApi from '@api/v1/transaction';
import { DATABASE_HOST, PORT } from '@config';
import Database from '@database';
import MidtransPayment from '@plugins/Midtrans';
import Server from '@server';
import AuthServices from '@services/auth';
import CompanyService from '@services/Company';
import ContentService from '@services/content';
import MembershipService from '@services/membership';
import MembershipModel from '@services/membership/model';
import PackageService from '@services/package';
import PackageModel from '@services/package/model';
import TransactionService from '@services/transaction';
import TransactionModel from '@services/transaction/model';

// TODO Add validation mac length express validator
const membershipService = new MembershipService(new MembershipModel());
const packageService = new PackageService(new PackageModel());
const transactionService = new TransactionService(
  new TransactionModel(),
  membershipService,
  packageService,
  new MidtransPayment()
);
const authApi: AuthApi = new AuthApi(new AuthServices(membershipService));
const packageApi: PackageApi = new PackageApi(packageService);
const transactionApi: TransactionApi = new TransactionApi(transactionService);
const contentApi: ContentApi = new ContentApi(new ContentService());
const companyApi: CompanyApi = new CompanyApi(new CompanyService());
const database = new Database(DATABASE_HOST);

export const newServer = new Server(
  { port: PORT, database: database },
  authApi,
  packageApi,
  transactionApi,
  contentApi,
  companyApi
);
newServer.run();
