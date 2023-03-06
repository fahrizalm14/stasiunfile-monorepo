// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { InvariantError, AuthenticationError } from '@error';

/**
 * Class AuthValidation
 * Checking payload and throw error `400 bad request`
 * @class AuthValidation
 */
export default class AuthValidation {
  /**
   * Register Validation
   * @method register
   * @param publicAddress string
   * @param phoneNumber string
   * @returns `Promise<void>`
   * @throws InvariantError("Public address invalid value!")
   * @throws InvariantError("Phone number invalid value!")
   */
  public async register(
    publicAddress: string,
    phoneNumber: string
  ): Promise<void> {
    if (
      publicAddress === '' ||
      typeof publicAddress !== 'string' ||
      !publicAddress
    )
      throw new InvariantError('Public address invalid value!');

    if (phoneNumber === '' || typeof phoneNumber !== 'string' || !phoneNumber)
      throw new InvariantError('Phone number invalid value!');
  }

  /**
   * @async Pre login Validation
   * @param publicAddress string
   * @returns ` Promise<void>`
   * @throws InvariantError("Public address invalid value!")
   */
  public async preLogin(publicAddress: string): Promise<void> {
    if (
      publicAddress === '' ||
      typeof publicAddress !== 'string' ||
      !publicAddress
    )
      throw new InvariantError('Public address invalid value!');
  }

  public async refreshToken(token?: string): Promise<void> {
    if (token === '' || typeof token !== 'string' || !token)
      throw new AuthenticationError('Refresh token invalid value!');
  }

  /**
   * Login validation
   * @method login
   * @param publicAddress string
   * @param message string
   * @param signature string
   * @returns `Promise<void>`
   * @throws InvariantError("Public address invalid value!")
   * @throws InvariantError("Message invalid value!")
   * @throws InvariantError("Signature invalid value!")

   */
  public async login(
    publicAddress: string,
    message: string,
    signature: string
  ): Promise<void> {
    if (
      publicAddress === '' ||
      typeof publicAddress !== 'string' ||
      !publicAddress
    )
      throw new InvariantError('Public address invalid value!');

    if (message === '' || typeof message !== 'string' || !message)
      throw new InvariantError('Message invalid value!');

    if (!signature || signature === '' || typeof signature !== 'string')
      throw new InvariantError('Signature invalid value!');
  }

  /**
   * Web3 Login Validation
   * @method web3Login
   * @param publicAddress string
   * @param signature string
   * @returns `Promise<void>`
   * @throws InvariantError("Signature invalid value!")
   */
  public async web3Login(
    publicAddress: string,
    signature: string
  ): Promise<void> {
    if (
      publicAddress === '' ||
      typeof publicAddress !== 'string' ||
      !publicAddress
    )
      throw new InvariantError('Public address invalid value!');
    if (signature === '' || typeof signature !== 'string' || !signature)
      throw new InvariantError('Signature invalid value!');

    const signatureLength: number = Buffer.byteLength(signature, 'hex');
    if (signatureLength < 66)
      throw new InvariantError('Signature invalid value!');
  }

  /**
   * Generate Signature Web3 Validation
   * @method generateSignatureWeb3
   * @param key string
   * @param message string
   * @returns `Promise<void>`
   * @throws InvariantError("Message invalid value!")
   * @throws InvariantError("Key invalid value!")
   */
  public async generateSignatureWeb3(
    key: string,
    message: string
  ): Promise<void> {
    if (message === '' || typeof message !== 'string' || !message)
      throw new InvariantError('Message invalid value!');
    if (typeof key !== 'string') throw new InvariantError('Key invalid value!');
    const keyLength: number = Buffer.byteLength(key, 'hex');
    if (key === '' || keyLength < 33)
      throw new InvariantError('Key invalid value!');
  }
}
