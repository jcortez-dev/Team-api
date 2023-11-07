import ClubLogic from '../../../src/business-logic/club';
import { returnErrorResponse } from '../../../src/errors/error-response';
import list from '../../../src/controllers/club/list.controller';

jest.mock('../../../src/business-logic/club', () => ({
  list: jest.fn(),
}));

jest.mock('../../../src/errors/error-response', () => ({
  returnErrorResponse: jest.fn(),
}));

describe('list', () => {
  it('should return a list of clubs if ClubLogic.list is successful', async () => {
    const clubsList = [{ }, { }];
    ClubLogic.list.mockResolvedValueOnce(clubsList);

    const res = {
      send: jest.fn(),
    };

    await list(null, res);

    expect(ClubLogic.list).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({ clubs: clubsList });
    expect(returnErrorResponse.returnErrorResponse).not.toHaveBeenCalled();
  });

  it('should return an error response if ClubLogic.list fails', async () => {
    const error = new Error('Error retrieving clubs');
    ClubLogic.list.mockRejectedValueOnce(error);

    const res = {
      send: jest.fn(),
    };

    await list(null, res);

    expect(ClubLogic.list).toHaveBeenCalled();
    expect(returnErrorResponse.returnErrorResponse).toHaveBeenCalledWith({ error, res });
    expect(res.send).not.toHaveBeenCalled();
  });
});
