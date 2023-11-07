import UserModel from '../../../src/models/user/user.model';
import getOne from '../../../src/business-logic/users/get-one';

jest.mock('../../../src/models/user/user.model', () => ({
  findOne: jest.fn(),
}));

describe('getOne', () => {
  it('should return a user if UserModel.findOne is successful', async () => {
    const query = { };
    const select = ['field1', 'field2'];
    const populate = ['field3', 'field4'];

    const user = { };
    UserModel.findOne.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(user),
    });

    const result = await getOne({ query, select, populate });

    expect(UserModel.findOne).toHaveBeenCalledWith(query);
    expect(result).toEqual(user);
  });

  it('should handle empty select and populate arrays', async () => {
    const query = { };
    const select = [];
    const populate = [];

    const user = { };
    UserModel.findOne.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(user),
    });

    const result = await getOne({ query, select, populate });

    expect(UserModel.findOne).toHaveBeenCalledWith(query);
    expect(result).toEqual(user);
  });

  it('should return null if UserModel.findOne does not find a user', async () => {
    const query = { };
    const select = ['field1', 'field2'];
    const populate = ['field3', 'field4'];

    UserModel.findOne.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(null),
    });

    const result = await getOne({ query, select, populate });

    expect(UserModel.findOne).toHaveBeenCalledWith(query);
    expect(result).toBeNull();
  });
});
