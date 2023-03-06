// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import ClientError from './ClientError';


export default class AuthorizationError extends ClientError {
  constructor(message: string | undefined) {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}
