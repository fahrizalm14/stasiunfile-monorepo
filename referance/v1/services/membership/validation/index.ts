// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { InvariantError } from '@error';
import IRegister from '@interfaces/IRegister';
import { isValidObjectId } from 'mongoose';

/**
 * Class MembershipValidation
 * Checking payload and throw error `400 bad request`
 * @class MembershipValidation
 */
export default class MembershipValidation {
  /**
   * Save Validation
   * @method save
   * @param payload IRegister
   * @returns `Promise<void>`
   * @throws InvariantError("Public address invalid value!")
   * @throws InvariantError("Phone number invalid value!")
   * @throws InvariantError("Storage invalid value!")
   * @throws InvariantError("Expired invalid value!")
   */
  public async save(payload: IRegister): Promise<void> {
    const { publicAddress, phoneNumber, storage, expired } = payload;
    if (
      publicAddress === "" ||
      typeof publicAddress !== "string" ||
      !publicAddress
    )
      throw new InvariantError("Public address invalid value!");

    if (phoneNumber === "" || typeof phoneNumber !== "string" || !phoneNumber)
      throw new InvariantError("Phone number invalid value!");

    if (storage < 0 || typeof storage !== "number")
      throw new InvariantError("Storage invalid value!");

    if (expired < 0 || typeof expired !== "number")
      throw new InvariantError("Expired invalid value!");
  }

  /**
   * Get public address validation
   * @method getByPublicAddress
   * @param publicAddress string
   * @returns `Promise<void>`
   * @throws InvariantError("Public address invalid value!")
   */
  public async getByPublicAddress(publicAddress: string): Promise<void> {
    if (
      publicAddress === "" ||
      typeof publicAddress !== "string" ||
      !publicAddress
    )
      throw new InvariantError("Public address invalid value!");
  }

  /**
   * Get phone number validation
   * @method checkPhoneNumber
   * @param phoneNumber string
   * @returns `Promise<void>`
   * @throws InvariantError("Phone number invalid value!")
   */
  public async checkPhoneNumber(phoneNumber: string): Promise<void> {
    if (phoneNumber === "" || typeof phoneNumber !== "string" || !phoneNumber)
      throw new InvariantError("Phone number invalid value!");
  }

  /**
   *
   * @param _id string
   * @param _newData object
   * @returns `Promise<void>`
   * @throws InvariantError("Id invalid value!")
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async updateById(_id: string, _newData: object): Promise<void> {
    // TODO Validate newdate
    if (!_newData) throw new InvariantError("New date requied!");
    if (!isValidObjectId(_id) || typeof _id !== "string")
      throw new InvariantError("Id invalid value!");
  }

  /**
   *
   * @param _id string
   * @returns `Promise<void>`
   * @throws InvariantError("Id invalid value!")
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getById(_id: string): Promise<void> {
    if (!isValidObjectId(_id) || typeof _id !== "string")
      throw new InvariantError("Id invalid value!");
  }
}
