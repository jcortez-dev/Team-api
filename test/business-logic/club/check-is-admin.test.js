import { expect, jest } from '@jest/globals';
import HTTPError from '../../../src/errors/http.error';
import ClubModel from '../../../src/models/club/club.model';
import checkIfTheUserIsTheClubAdmin from '../../../src/business-logic/club/check-is-admin';


jest.mock('../../../src/models/club/club.model');

describe('Business logic: checkIfTheUserIsTheClubAdmin', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

    const clubId = 'validClubId';
    const userId = 'adminUserId';

  it('Should not throw an error when the user is the admin of the club', async () => {
    ClubModel.findOne.mockResolvedValue({ _id: clubId, admin: userId });
    
    await expect(checkIfTheUserIsTheClubAdmin({ clubId, userId })).resolves.not.toThrow();
  });

  it('Should throw a 403 error when the user is not the admin of the club', async () => {
    
    const userId = 'nonAdminUserId';

    ClubModel.findOne.mockResolvedValue(null);

    await expect(checkIfTheUserIsTheClubAdmin({ clubId, userId })).rejects.toThrow(HTTPError);
  });

  it('Should throw a 403 error when an error occurs during the database query', async () => {
    checkIfTheUserIsTheClubAdmin.mockRejectedValue(
        new HTTPError({ ...clubErrors.userIsNotTheAdmin, code: 403 }),
      );
      try {
        await create({ clubId: 'asd1' });
      } catch (error) {
        expect(error.message).toEqual(clubErrors.userIsNotTheAdmin.message);
        expect(error.name).toEqual(clubErrors.userIsNotTheAdmin.name);
        expect(error.statusCode).toEqual(403);
        expect(error).toEqual(new HTTPError({ ...clubErrors.userIsNotTheAdmin, code: 403 }));
      }
  });
});

