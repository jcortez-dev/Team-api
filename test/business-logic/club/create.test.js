import { expect, jest } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import UserLogic from '../../../src/business-logic/users';
import create from '../../../src/business-logic/club/create';
import mongoose from 'mongoose';
import HTTPError from '../../../src/errors/http.error';


jest.mock('../../../src/business-logic/users');

describe('Business logic: Club: Create', () => {
  const club = {
    name: 'club-test',
    description: 'description',
  };

  const createObjectId = () => new mongoose.Types.ObjectId();

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it('Should create a club on database', async () => {
    const adminId = createObjectId();

    UserLogic.getOne.mockReturnValue({ _id: adminId });

    const result = await create({ ...club, adminId });

    expect(UserLogic.getOne).toHaveBeenCalled();
    expect(result).not.toBeNull();
    expect(result.name).toEqual(club.name);
    expect(result.description).toEqual(club.description);
    expect(result.admin).toEqual(adminId);
  });

  it('Should propagate an error when UserLogic.getOne throw an error', async () => {
    const error = new HTTPError({ name: 'error', message: 'some-error', code: 500 });
    UserLogic.getOne.mockRejectedValue(error);

    try {
      await create({ ...club, adminId: 'some-id' });
      throw new Error('unexpected error');
    } catch (error) {
      expect(UserLogic.getOne).toHaveBeenCalled();
      expect(error).not.toBeNull();
      expect(error.name).toEqual('error');
      expect(error.message).toEqual('some-error');
    }
  });
});
