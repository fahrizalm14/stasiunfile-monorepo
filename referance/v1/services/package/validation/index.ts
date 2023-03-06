// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { InvariantError } from '@error';
import IPackage from '@interfaces/IPackage';
import { isValidObjectId } from 'mongoose';

/**
 * Class Packagevalidation
 * Checking payload and throw error `400 bad request`
 * @class Packagevalidation
 */
export default class Packagevalidation {
  /**
   * Get by id validation
   * @method getById
   * @param _id string
   * @returns `Promise<void>`
   * @throws InvariantError("Id invalid value!")
   */
  public async getById(_id: string): Promise<void> {
    if (!isValidObjectId(_id) || !_id)
      throw new InvariantError("Id invalid value!");
  }

  /**
   * Save validation
   * @param payload string
   * @returns `Promise<void>`
   * @throws InvariantError("Name invalid value!")
   * @throws InvariantError("Storage invalid value!")
   * @throws InvariantError("Storage invalid value!")
   * @throws InvariantError("Expired invalid value!")
   */
  public async save(payload: IPackage): Promise<void> {
    const { name, price, storage, expired }: IPackage = payload;
    if (name === "" || typeof name !== "string" || !name)
      throw new InvariantError("Name invalid value!");
    if (price <= 0 || typeof price !== "number")
      throw new InvariantError("Price invalid value!");
    if (storage <= 0 || typeof storage !== "number")
      throw new InvariantError("Storage invalid value!");
    if (typeof expired !== "number")
      throw new InvariantError("Expired invalid value!");
  }

  /**
   * Delete validation
   * @method delete
   * @param _id string
   * @returns `Promise<void>`
   * @throws InvariantError("Id invalid value!")
   */
  public async delete(_id: string): Promise<void> {
    if (!isValidObjectId(_id) || !_id)
      throw new InvariantError("Id invalid value!");
  }

  /**
   * Activate validation
   * @method actuvate
   * @param _id string
   * @returns `Promise<void>`
   * @throws InvariantError("Id invalid value!")
   */
  public async activate(_id: string): Promise<void> {
    if (!isValidObjectId(_id) || !_id)
      throw new InvariantError("Id invalid value!");
  }

  /**
   * Deactivate validation
   * @method deactivate
   * @param _id string
   * @returns `Promise<void>`
   * @throws InvariantError("Id invalid value!")
   */
  public async deactivate(_id: string): Promise<void> {
    if (!isValidObjectId(_id) || !_id)
      throw new InvariantError("Id invalid value!");
  }
}
