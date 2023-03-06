import { Readable } from 'stream';
// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export interface CallbackUpload {
  (total: number): void;
}
export default interface IStorageEngine {
  upload(
    path: string,
    name: string,
    password?: string
  ): Promise<{ Key: string }>;
  uploadStream(
    Body: any,
    name: string,
    callback?: CallbackUpload
  ): Promise<{ Key: string }>;
  download(Key: string, password?: string): Promise<Buffer>;
  downloadWithoutEncryption(
    Key: string
  ): Promise<{ Body: Readable; ContentLength: number | undefined }>;
  delete(Key: string, bucket?: string): Promise<boolean>;
}
