// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  ALGORITHM_NAME_ENCRYPTION,
  IV_LENGTH_NAME_ENCRYPTION,
  NAME_ENCRYPTION_KEY
} from '@config';
import crypto from 'crypto';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';

export default class Encryption {
  private ALGORITHM_NAME_ENCRYPTION: string = ALGORITHM_NAME_ENCRYPTION;
  private IV_LENGTH_NAME_ENCRYPTION: number = IV_LENGTH_NAME_ENCRYPTION;
  private NAME_ENCRYPTION_KEY: string = NAME_ENCRYPTION_KEY;

  public encryptFileName(data: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH_NAME_ENCRYPTION);
    const cipher = crypto.createCipheriv(
      this.ALGORITHM_NAME_ENCRYPTION,
      Buffer.from(this.NAME_ENCRYPTION_KEY, 'hex'),
      iv
    );
    return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(
      'hex'
    );
  }

  public decryptFileName(data: string): string {
    const binaryData = Buffer.from(data, 'hex');
    const iv = binaryData.slice(-this.IV_LENGTH_NAME_ENCRYPTION);
    const encryptedData = binaryData.slice(
      0,
      binaryData.length - this.IV_LENGTH_NAME_ENCRYPTION
    );
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM_NAME_ENCRYPTION,
      Buffer.from(this.NAME_ENCRYPTION_KEY, 'hex'),
      iv
    );

    return Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ]).toString();
  }

  public encryptFile(filePath: string, password?: string): Buffer {
    const buffer = readFileSync(filePath);

    if (!password || password === '') {
      console.log('tidak encrypt');
      return readFileSync(filePath);
    }

    console.log('encrypt ya');
    const key: string = this.sha256L32(password);
    const iv = crypto.randomBytes(16);
    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    // Create the new (encrypted) buffer
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return result;
  }

  public async decryptFile(file: any, password?: string): Promise<Buffer> {
    if (!password || password === '') {
      return await this.streamToBuffer(file);
    }
    const key: string = this.sha256L32(password);
    let buffer = await this.streamToBuffer(file);
    // Get the iv: the first 16 bytes
    const iv = buffer.slice(0, 16);
    // Get the rest
    buffer = buffer.slice(16);
    // Create a decipher
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    // Actually decrypt it
    const result = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return result;
  }

  public convertFile(filePath: string, convert: Buffer): void {
    if (!existsSync(path.dirname(filePath))) {
      mkdirSync(path.dirname(filePath));
    }
    createWriteStream(filePath).write(convert);
  }

  public async sha256(password: string): Promise<string> {
    return crypto.createHash('sha256').update(password).digest('base64');
  }

  private sha256L32(value: string): string {
    //   sha256 length 32
    return crypto
      .createHash('sha256')
      .update(value)
      .digest('base64')
      .substring(0, 32);
  }

  private async streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk: any) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
