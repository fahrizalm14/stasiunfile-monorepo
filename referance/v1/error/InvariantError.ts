// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ClientError from './ClientError';


//* Digunakan pada saat erronya belum diketahui kodenya dan akan terpanggil didalam instance clientError
export default class InvariantError extends ClientError {
  constructor(message: string | undefined) {
    super(message);
    this.name = "InvariantError";
  }
}
