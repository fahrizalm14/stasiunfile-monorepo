// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import IAwsConfig from '@interfaces/IAwsConfig';
import 'dotenv/config';

export const PORT = parseInt(process.env.PORT!) || 2000;
export const DATABASE_HOST: string = process.env.DATABASE_HOST!;

export const ACCESS_TOKEN_KEY: string = process.env.ACCESS_TOKEN_KEY!;
export const REFRESH_TOKEN_KEY: string = process.env.REFRESH_TOKEN_KEY!;
export const ACCESS_TOKEN_EXPIRED: string = process.env.ACCESS_TOKEN_EXPIRED!;
export const REFRESH_TOKEN_EXPIRED: string = process.env.REFRESH_TOKEN_EXPIRED!;

export const MIDTRANS_CLIENT_KEY: string = process.env.MIDTRANS_CLIENT_KEY!;

export const MIDTRANS_SERVER_KEY: string = process.env.MIDTRANS_SERVER_KEY!;
export const MIDTRANS_IS_PRODUCTION: boolean =
  process.env.MIDTRANS_IS_PRODUCTION === 'true' ? true : false;

export const ALGORITHM_NAME_ENCRYPTION: string =
  process.env.ALGORITHM_NAME_ENCRYPTION!;
export const ENCODING_NAME_ENCRYPTION: string =
  process.env.ENCODING_NAME_ENCRYPTION!;
export const IV_LENGTH_NAME_ENCRYPTION: number = parseInt(
  process.env.IV_LENGTH_NAME_ENCRYPTION!
);
export const NAME_ENCRYPTION_KEY: string = process.env.NAME_ENCRYPTION_KEY!;
export const X_SF_ISSUER: string = process.env.X_SF_ISSUER!;

export const AwsConfig: IAwsConfig = {
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION!,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME!,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY!,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!
};

export const FileConfig = {
  DEFAULT_LIMIT: parseInt(process.env.DEFAULT_LIMIT!),
  DEFAULT_EXPIRED: parseInt(process.env.DEFAULT_EXPIRED!),
  DEFAULT_SIZE: parseInt(process.env.DEFAULT_SIZE!),
  FREE_LIMIT_SIZE: parseInt(process.env.FREE_LIMIT_SIZE!),
  E2E_LIMIT_SIZE: parseInt(process.env.E2E_LIMIT_SIZE!),
  CODE_LENGTH: parseInt(process.env.CODE_LENGTH!),
  DIRECTORY_EXT: process.env.DIRECTORY_EXT!,
  URL_DOWNLOAD: process.env.URL_DOWNLOAD,
  URL_VIEW: process.env.URL_VIEW,
  URL_DIRECTORY: process.env.URL_DIRECTORY
};

export const FIREBASE_SERVICE = JSON.parse(process.env.FIREBASE!);
export const MEMBER_EXPIRED: number = parseInt(process.env.MEMBER_EXPIRED!);
export const MEMBER_STORAGE: number = parseInt(process.env.MEMBER_STORAGE!);
