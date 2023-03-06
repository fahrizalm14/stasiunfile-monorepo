// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ClientError from './ClientError';


export default class AuthenticationError extends ClientError {
  constructor(message: string | undefined) {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}
