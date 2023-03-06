// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { AwsConfig } from '@config';
import IAwsConfig from '@interfaces/IAwsConfig';
import IStorageEngine from '@interfaces/IStorageEngine';
import Encryption from '@utils/Encryption';
import { Readable } from 'stream';

interface CallbackUpload {
  (total: number): void;
}
export default class AWSS3 implements IStorageEngine {
  async uploadStream(
    Body: any,
    name: string,
    callback: CallbackUpload
  ): Promise<{ Key: string }> {
    const Key = `${this.end2end.encryptFileName(name)}.sfid`;
    const params = {
      Body,
      Bucket: this.config.AWS_BUCKET_NAME,
      ContentType: '',
      Key
    };

    const parallelUploads3 = new Upload({
      client: this.client,
      queueSize: 4, // optional concurrency configuration
      partSize: 5242880, // optional size of each part
      leavePartsOnError: false, // optional manually handle dropped parts
      params
    });

    let total = 0;

    parallelUploads3.on('httpUploadProgress', (progress) => {
      if (progress.loaded) total = progress.loaded;
    });
    await parallelUploads3.done();
    callback(total);
    return { Key };
  }
  private readonly config: IAwsConfig = AwsConfig;
  private readonly client: S3Client = new S3Client({
    region: this.config.AWS_BUCKET_REGION,
    credentials: {
      accessKeyId: this.config.S3_ACCESS_KEY,
      secretAccessKey: this.config.S3_SECRET_ACCESS_KEY
    }
  });
  public readonly end2end: Encryption = new Encryption();

  public async upload(
    path: string,
    name: string,
    password?: string
  ): Promise<{ Key: string }> {
    const buffer = this.end2end.encryptFile(path, password);
    const Key = `${this.end2end.encryptFileName(name)}.sfid`;
    const params = {
      Body: buffer,
      Bucket: this.config.AWS_BUCKET_NAME,
      ContentType: '',
      Key
    };

    const parallelUploads3 = new Upload({
      client: this.client,
      queueSize: 4, // optional concurrency configuration
      partSize: 5242880, // optional size of each part
      leavePartsOnError: false, // optional manually handle dropped parts
      params
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(`progress ${JSON.stringify(progress)}`);
    });

    await parallelUploads3.done();
    return { Key };
  }

  public async download(Key: string, password?: string): Promise<Buffer> {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: this.config.AWS_BUCKET_NAME,
      Key
    });
    const data = await this.client.send(command);

    return this.end2end.decryptFile(data.Body, password);
  }

  public async downloadWithoutEncryption(Key: string): Promise<{
    Body: Readable;
    ContentLength: number | undefined;
  }> {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: this.config.AWS_BUCKET_NAME,
      Key
    });
    const { Body, ContentLength } = await this.client.send(command);

    return {
      Body: Body as Readable,
      ContentLength
    };
  }

  public async delete(Key: string, bucket?: string): Promise<boolean> {
    const Bucket = bucket || this.config.AWS_BUCKET_NAME;
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket,
      Key
    });

    const data = await this.client.send(command);

    console.log(data);
    return true;
  }
}
