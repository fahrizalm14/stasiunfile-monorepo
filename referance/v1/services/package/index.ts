// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { InvariantError, NotFoundError } from '@error';
import IPackage from '@interfaces/IPackage';
import IPackageModel from '@interfaces/IPackageModel';
import IPackageService from '@interfaces/IPackageService';
import { PackageStatus } from '@utils/type';

import Packagevalidation from './validation';
import bytes from 'bytes';

/**
 * @class Packageservice
 * @implements IPackageService
 * @interface IPackageService
 * @param model IPackageModel
 * @instance `validator`: Packagevalidation
 */
export default class PackageService implements IPackageService {
  private readonly validator: Packagevalidation = new Packagevalidation();
  constructor(private model: IPackageModel) {}

  /**
   * Get all packages
   * @method getAll
   * @returns `Promise<IPackage[]>`
   * @throws InvariantError("Find package failed!")
   */
  public async getAll(): Promise<IPackage[]> {
    const query: IPackage[] = await this.model.getAll();
    // .catch((e) => {
    //   console.log(`getAll error: ${e.message}`);
    //   throw new InvariantError("Find package failed!");
    // });
    const data = query.map((item: IPackage) => {
      const rupiah = item.price.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
      });
      const expiredMonth = Math.floor(item.expired / 86400000 / 30);
      const storageString = bytes(item.storage);
      return { ...item, expiredMonth, storageString, rupiah };
    });

    return data;
  }

  /**
   * Get package by id
   * @method getById
   * @param _id string
   * @returns `Promise<IPackage>`
   * @throws InvariantError("Package not found!")
   * @throws InvariantError("Id invalid value!")
   */
  public async getById(_id: string): Promise<IPackage> {
    // Validaating _id value
    await this.validator.getById(_id);
    const data: IPackage | null = await this.model.getById(_id);
    if (!data) throw new NotFoundError('Package not found!');
    const expiredMonth = Math.floor(data.expired / 86400000 / 30);
    const storageString = bytes(data.storage);

    return { ...data, expiredMonth, storageString };
  }

  /**
   * Save new package and store to database
   * @method save
   * @param payload IPackage
   * @returns `Promise<IPackage>`
   * @throws InvariantError("Saving package failed!")
   * @throws InvariantError("Name invalid value!")
   * @throws InvariantError("Storage invalid value!")
   * @throws InvariantError("Storage invalid value!")
   * @throws InvariantError("Expired invalid value!")
   */
  public async save(payload: IPackage): Promise<IPackage> {
    // Validating payload value
    await this.validator.save(payload);
    const { name, price, storage, expired }: IPackage = payload;
    const newDate = new Date();
    // Set status to notActive
    const status = PackageStatus.NOT_ACTIVE;

    const data: IPackage = await this.model.save({
      name,
      price,
      storage,
      expired,
      status,
      createdAt: newDate,
      updatedAt: newDate
    });
    // .catch((e) => {
    //   console.log(`save package message error: ${e.message}`);
    //   throw new InvariantError("Saving package failed!");
    // });

    return data;
  }

  /**
   * Deleting package by id from database
   * @method delete
   * @param _id string
   * @returns `Promise<boolean>`
   * @throws InvariantError("Package not found!")
   * @throws InvariantError("Id invalid value!")
   */
  public async delete(_id: string): Promise<boolean> {
    // Validating _id value
    await this.validator.delete(_id);

    const data: boolean = await this.model.delete(_id);

    if (!data) throw new NotFoundError('Package not found!');

    return true;
  }

  /**
   * Activing package and update to database
   * @method activate
   * @param _id string
   * @returns `Promise<boolean>`
   * @throws InvariantError("Activate package failed")
   * @throws InvariantError("Id invalid value!")
   */
  public async activate(_id: string): Promise<boolean> {
    // Validating _id value
    await this.validator.activate(_id);
    const updatedAt: Date = new Date();
    const status = PackageStatus.ACTIVE; //Set status to active
    const data: IPackage | null = await this.model.updateById(_id, {
      status,
      updatedAt
    });

    if (!data || data.status !== status)
      throw new InvariantError('Activate package failed!');

    return true;
  }

  /**
   * Deactiving package and update to database
   * @method deactivate
   * @param _id string
   * @returns `Promise<boolean>`
   * @throws InvariantError("Deactivate package failed")
   * @throws InvariantError("Id invalid value!")
   */
  public async deactivate(_id: string): Promise<boolean> {
    // Validating _id value
    await this.validator.deactivate(_id);
    const updatedAt: Date = new Date();
    const status = PackageStatus.NOT_ACTIVE; //Set status to notActive
    const data: IPackage | null = await this.model.updateById(_id, {
      status,
      updatedAt
    });

    if (!data || data.status !== status)
      throw new InvariantError('Deactivate package failed!');

    return true;
  }
}
