// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

//* Digunakan di atas server error
export default class ClientError extends Error {
  statusCode: number;
  name = "ClientError";
  constructor(message: string | undefined, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
