// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ClientError from './ClientError';


// * Digunakan ketika data tidak ditemukan dan akan terpanggil didalam instance clientError
export default class NotFoundError extends ClientError {
  name = "NotFoundError";
  constructor(message: string | undefined) {
    super(message, 404);
  }
}
